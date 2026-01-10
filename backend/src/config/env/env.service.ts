import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvVars } from './env.zod';

/**
 * Servicio tipado para variables de entorno.
 */
@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService<EnvVars>) {}

  get port(): number {
    return this.config.getOrThrow('PORT');
  }

  get corsOrigin(): string {
    return this.config.getOrThrow('CORS_ORIGIN');
  }

  get nodeEnv(): EnvVars['NODE_ENV'] {
    return this.config.getOrThrow('NODE_ENV');
  }

  // 🔐 AUTH

  get jwtAccessSecret(): string {
    return this.config.getOrThrow('JWT_ACCESS_SECRET');
  }

  get jwtAccessExpiresIn(): `${number}${'s' | 'm' | 'h' | 'd'}` {
    return this.config.getOrThrow('JWT_ACCESS_EXPIRES_IN');
  }

  get jwtRefreshSecret(): string {
    return this.config.getOrThrow('JWT_REFRESH_SECRET');
  }

  get jwtRefreshExpiresInDays(): number {
    return this.config.getOrThrow('JWT_REFRESH_EXPIRES_IN_DAYS');
  }

  // 🔐 REDIS

  get redisHost(): string {
    return this.config.getOrThrow('REDIS_HOST');
  }

  get redisPort(): number {
    return this.config.getOrThrow('REDIS_PORT');
  }

  get redisPassword(): string | undefined {
    return this.config.get('REDIS_PASSWORD');
  }

  get redisDatabase(): number {
    return this.config.getOrThrow('REDIS_DATABASE');
  }
}
