import { PASSWORD_HASHER } from '@auth/application/tokens/password-hasher.token';
import { USER_REPOSITORY } from '@auth/application/tokens/user-repository.token';
import { CreateUserUseCase } from '@auth/application/use-cases/User/Create.use-case';
import { UserController } from '@auth/infrastructure/controllers/User.controller';
import { ArgonPasswordHasher } from '@auth/infrastructure/crypto/PasswordHasher.adapter';
import { PrismaUserRepository } from '@auth/infrastructure/prisma/PrismaUserRepository';
import { Module } from '@nestjs/common';


/**
 * Módulo de usuarios
 */
@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,

    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: ArgonPasswordHasher,
    },
  ],
})
export class UserModule {}

