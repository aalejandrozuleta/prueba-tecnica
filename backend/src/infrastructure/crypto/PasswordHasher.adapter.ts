import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { PasswordHasher } from '@auth/application/ports/PasswordHasher.port';

@Injectable()
export class ArgonPasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    try {
      return await argon2.hash(plain, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
      });
    } catch {
      throw new InternalServerErrorException('PASSWORD_HASH_FAILED');
    }
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      throw new InternalServerErrorException('PASSWORD_VERIFY_FAILED');
    }
  }
}
