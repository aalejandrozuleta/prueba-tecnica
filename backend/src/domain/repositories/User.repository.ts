import { User } from '../entities/User.entity';
import { Email } from '../value-objects/Email.vo';

export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  create(data: User): Promise<User>;
}
