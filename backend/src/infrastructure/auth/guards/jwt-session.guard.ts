import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { AuthUser } from '../types/auth-user.type';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

/**
 * Guard que valida:
 * 1. JWT válido
 * 2. Sesión activa en Redis
 */
@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    /**
     * 1️⃣ Obtener access token desde cookies
     */
    const token = request.cookies?.access_token;

    if (!token) {
      throw ExceptionFactory.unauthorized();
    }

    let payload: AuthUser;

    /**
     * 2️⃣ Verificar JWT
     */
    try {
      payload = this.jwtService.verify<AuthUser>(token);
    } catch {
      throw ExceptionFactory.unauthorized();
    }

    /**
     * 3️⃣ Verificar sesión activa en Redis
     */
    const sessionKey = `session:${payload.sessionId}`;
    const exists = await this.redis.exists(sessionKey);

    if (exists !== 1) {
      throw ExceptionFactory.sessionExpired();
    }

    /**
     * 4️⃣ Adjuntar usuario al request
     */
    request.user = payload;

    return true;
  }
}

