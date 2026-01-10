/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.access_token;

    if (typeof token !== 'string') {
      throw ExceptionFactory.unauthorized();
    }

    let payload: AuthUser;

    try {
      payload = this.jwtService.verify<AuthUser>(token);
    } catch {
      throw ExceptionFactory.unauthorized();
    }

    const sessionKey = `session:${payload.sessionId}`;
    const exists = await this.redis.exists(sessionKey);

    if (exists !== 1) {
      throw ExceptionFactory.sessionExpired();
    }

    request.user = payload;

    return true;
  }
}
