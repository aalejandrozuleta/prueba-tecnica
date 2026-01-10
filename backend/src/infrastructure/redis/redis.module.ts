import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { EnvModule } from '@auth/config/env/env.module';

import { EnvService } from '@/config/env/env.service';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

/**
 * Módulo global de Redis
 */
@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [EnvService],
      useFactory: (env: EnvService) =>
        new Redis({
          host: env.redisHost,
          port: env.redisPort,
          password: env.redisPassword,
          db: env.redisDatabase,
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule { }

