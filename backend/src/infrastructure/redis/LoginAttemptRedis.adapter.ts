import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { LoginAttemptRepository } from '@auth/application/ports/LoginAttemptRepository.port';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

@Injectable()
export class LoginAttemptRedisAdapter implements LoginAttemptRepository {
  private static readonly FAIL_TTL_SECONDS = 15 * 60; // 15 min

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private failKey(email: string, ip: string): string {
    return `login:fail:${email}:${ip}`;
  }

  private blockKey(email: string, ip: string): string {
    return `login:block:${email}:${ip}`;
  }

  async isBlocked(email: string, ip: string): Promise<boolean> {
    return (await this.redis.exists(this.blockKey(email, ip))) === 1;
  }

  async increment(email: string, ip: string): Promise<number> {
    const key = this.failKey(email, ip);

    const attempts = await this.redis.incr(key);

    // Si es el primer intento, seteamos TTL
    if (attempts === 1) {
      await this.redis.expire(key, LoginAttemptRedisAdapter.FAIL_TTL_SECONDS);
    }

    return attempts;
  }

  async reset(email: string, ip: string): Promise<void> {
    await this.redis.del(this.failKey(email, ip));
  }

  async block(email: string, ip: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.blockKey(email, ip), '1', 'EX', ttlSeconds);
  }
}
