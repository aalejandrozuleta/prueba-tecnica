/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';

import { AuthSessionService } from '@auth/application/ports/AuthSessionService.port';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

/**
 * Implementación de manejo de sesiones con JWT + Redis
 */
@Injectable()
export class AuthSessionServiceImpl implements AuthSessionService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userSessionKey = `user_session:${userId}`;

    // 1️⃣ ¿Ya existe una sesión para este usuario?
    let sessionId = await this.redis.get(userSessionKey);

    // 2️⃣ Si no existe, la creamos
    if (!sessionId) {
      sessionId = uuid();
      await this.redis.set(userSessionKey, sessionId, 'EX', 60 * 60 * 24);
    }

    const sessionKey = `session:${sessionId}`;

    const payload = {
      id: userId,
      email,
      name,
      sessionId,
    };

    // 3️⃣ Guardamos / renovamos la sesión
    await this.redis.set(sessionKey, JSON.stringify(payload), 'EX', 60 * 60 * 24);

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ sessionId }, { expiresIn: '7d' }),
    };
  }

  async refresh(refreshToken: string): Promise<string> {
    let payload: { sessionId: string };

    try {
      payload = this.jwtService.verify<{ sessionId: string }>(refreshToken);
    } catch {
      throw ExceptionFactory.invalidRefreshToken();
    }

    const sessionRaw = await this.redis.get(`session:${payload.sessionId}`);

    if (!sessionRaw) {
      throw ExceptionFactory.sessionExpired();
    }

    const session = JSON.parse(sessionRaw) as {
      id: string;
      email: string;
      name?: string;
      sessionId: string;
    };

    return this.jwtService.sign(
      {
        id: session.id,
        email: session.email,
        name: session.name,
        sessionId: session.sessionId,
      },
      { expiresIn: '15m' },
    );
  }

  async revokeSession(sessionId: string): Promise<void> {
    const sessionRaw = await this.redis.get(`session:${sessionId}`);

    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as { id: string };
      await this.redis.del(`user_session:${session.id}`);
    }

    await this.redis.del(`session:${sessionId}`);
  }
}
