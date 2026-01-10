import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import { EnvModule } from '@auth/config/env/env.module';

import { EnvService } from '@/config/env/env.service';

/**
 * Módulo global de Redis
 */
@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Redis,
      inject: [EnvService],
      useFactory: (env: EnvService) => {
        return new Redis({
          host: env.redisHost,
          port: env.redisPort,
          password: env.redisPassword,
        });
      },
    },
  ],
  exports: [Redis],
})
export class RedisModule {}
