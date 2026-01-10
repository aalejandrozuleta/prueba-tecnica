import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { AuthSessionService } from '@auth/application/ports/AuthSessionService.port';
import { PrismaService } from '@auth/infrastructure/prisma/config/prisma.service';

import { EnvService } from '@/config/env/env.service';

/**
 * Implementación del servicio de sesiones y tokens de autenticación
 */
@Injectable()
export class AuthSessionServiceImpl implements AuthSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly env: EnvService,
  ) {}

  /**
   * Crea una sesión con access token y refresh token
   */
  async createSession(
    userId: string,
    email: string,
    name?: string,
    meta?: {
      deviceId: string;
      ip: string;
      userAgent: string;
    },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
      name,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.env.jwtAccessSecret,
      expiresIn: this.env.jwtAccessExpiresIn,
    });

    const refreshToken = randomUUID();
    const hashedRefreshToken = await argon2.hash(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.env.jwtRefreshExpiresInDays);

    await this.prisma.authSession.create({
      data: {
        userId,
        refreshToken: hashedRefreshToken,
        deviceId: meta?.deviceId ?? 'unknown',
        ip: meta?.ip ?? 'unknown',
        userAgent: meta?.userAgent ?? 'unknown',
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Genera un nuevo access token usando un refresh token válido
   */
  async refresh(refreshToken: string): Promise<string> {
    const sessions = await this.prisma.authSession.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    for (const session of sessions) {
      const valid = await argon2.verify(session.refreshToken, refreshToken);

      if (!valid) {
        continue;
      }

      const accessToken = await this.jwtService.signAsync(
        { sub: session.userId },
        {
          secret: this.env.jwtAccessSecret,
          expiresIn: this.env.jwtAccessExpiresIn,
        },
      );

      await this.prisma.authSession.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      });

      return accessToken;
    }

    throw new Error('Refresh token inválido o expirado');
  }

  /**
   * Revoca una sesión específica
   */
  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
