import { User } from '@auth/domain/entities/User.entity';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { UserId } from '@auth/domain/value-objects/UserId.vo';

/**
 * Mapper Prisma → Dominio
 */
export function mapToDomain(record: {
  id: string;
  email: string;
  password: string;
  name: string | null;
}): User {
  return new User(
    UserId.fromString(record.id),
    record.name ?? '',
    new Email(record.email),
    HashedPassword.fromHash(record.password),
  );
}
