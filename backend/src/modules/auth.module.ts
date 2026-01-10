import { Module } from '@nestjs/common';

import { AUTH_SESSION_SERVICE } from '@auth/application/tokens/auth-session.token';
import { LOGIN_ATTEMPT_REPOSITORY } from '@auth/application/tokens/login-attempt.token';
import { PASSWORD_HASHER } from '@auth/application/tokens/password-hasher.token';
import { USER_REPOSITORY } from '@auth/application/tokens/user-repository.token';
import { LoginUserUseCase } from '@auth/application/use-cases/User/Login.use-case';
import { EnvModule } from '@auth/config/env/env.module';
import { JwtConfigModule } from '@auth/infrastructure/auth/jwt.module';
import { AuthController } from '@auth/infrastructure/controllers/Auth.controller';
import { ArgonPasswordHasher } from '@auth/infrastructure/crypto/PasswordHasher.adapter';
import { PrismaUserRepository } from '@auth/infrastructure/prisma/PrismaUserRepository';
import { LoginAttemptRedisAdapter } from '@auth/infrastructure/redis/LoginAttemptRedis.adapter';
import { RedisModule } from '@auth/infrastructure/redis/redis.module';
import { AuthSessionServiceImpl } from '@auth/infrastructure/auth/JwtAuthSession.service';

@Module({
  imports: [RedisModule, JwtConfigModule, EnvModule],
  controllers: [AuthController],
  providers: [
    // Use case
    LoginUserUseCase,

    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: ArgonPasswordHasher,
    },
    {
      provide: LOGIN_ATTEMPT_REPOSITORY,
      useClass: LoginAttemptRedisAdapter,
    },

    // Services
    {
      provide: AUTH_SESSION_SERVICE,
      useClass: AuthSessionServiceImpl,
    },
  ],
})
export class AuthModule {}
