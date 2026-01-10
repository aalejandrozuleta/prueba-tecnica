import { User } from '../entities/User.entity';
import { Email } from '../value-objects/Email.vo';

export interface UserRepository {
  // findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  // findAll(): Promise<User[]>;
  create(data: User): Promise<User>;
}
