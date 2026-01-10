import { Injectable } from '@nestjs/common';

import { User } from '@auth/domain/entities/User.entity';
import { UserRepository } from '@auth/domain/repositories/User.repository';
import { Email } from '@auth/domain/value-objects/Email.vo';

import { PrismaService } from './config/prisma.service';
import { mapToDomain } from './mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca un usuario por email
   */
  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return record ? mapToDomain(record) : null;
  }

  /**
   * Persiste un nuevo usuario
   */
  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        id: user.getId(),
        email: user.getEmail(),
        password: user.getPassword(),
        name: user.getName(),
      },
    });

    return mapToDomain(record);
  }
}
