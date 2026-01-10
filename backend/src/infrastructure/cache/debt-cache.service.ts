import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

/**
 * Servicio de cache Redis para deudas
 */
@Injectable()
export class DebtCacheService {
  constructor(@Inject(REDIS_CLIENT)
      private readonly redis: Redis,) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, data: unknown, ttlSeconds = 3600): Promise<void> {
    await this.redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
}
