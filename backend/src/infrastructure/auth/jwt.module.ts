import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from '@/config/env/env.module';
import { EnvService } from '@/config/env/env.service';

/**
 * Módulo global de JWT
 */
@Global()
@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.jwtAccessSecret,
        signOptions: {
          expiresIn: env.jwtAccessExpiresIn,
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
