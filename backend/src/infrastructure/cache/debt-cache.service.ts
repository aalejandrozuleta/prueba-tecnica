import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

/**
 * Servicio de cache Redis para deudas
 */
@Injectable()
export class DebtCacheService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Obtiene un valor del cache
   */
  async get<T>(key: string): Promise<T | null> {
    const value: string | null = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  /**
   * Guarda un valor en cache con TTL
   */
  async set(key: string, data: unknown, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(data);
    await this.redis.set(key, serialized, 'EX', ttlSeconds);
  }

  /**
   * Invalida cache usando patrón
   */
  async invalidateByPattern(pattern: string): Promise<void> {
    const keys: string[] = await this.redis.keys(pattern);

    if (keys.length === 0) {
      return;
    }

    await this.redis.del(...keys);
  }
}
