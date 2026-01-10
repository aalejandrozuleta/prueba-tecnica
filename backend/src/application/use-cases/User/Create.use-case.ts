import { Inject, Injectable, ConflictException } from '@nestjs/common';

import { CreateUserDto } from '@auth/application/dto/CreateUser.dto';
import { PasswordHasher } from '@auth/application/ports/PasswordHasher.port';
import { UserRepository } from '@auth/domain/repositories/User.repository';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { User } from '@auth/domain/entities/User.entity';
import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';

import { USER_REPOSITORY } from '@auth/application/tokens/user-repository.token';
import { PASSWORD_HASHER } from '@auth/application/tokens/password-hasher.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

/**
 * Caso de uso: crear usuario
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const email = new Email(dto.email);

    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
        throw ExceptionFactory.emailAlreadyExists(dto.email);
    }

    const hash = await this.passwordHasher.hash(dto.password);
    const password = HashedPassword.create(hash);

    const user = User.create({
      name: dto.name,
      email,
      password,
    });

    return this.userRepository.create(user);
  }
}
