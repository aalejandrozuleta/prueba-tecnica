import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { ArgonPasswordHasher } from './PasswordHasher.adapter';

jest.mock('argon2');

describe('ArgonPasswordHasher', () => {
  let hasher: ArgonPasswordHasher;

  beforeEach(() => {
    hasher = new ArgonPasswordHasher();
    jest.clearAllMocks();
  });

  describe('hash()', () => {
    it('debe retornar el hash generado por argon2', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await hasher.hash('plain-password');

      expect(result).toBe('hashed-password');
      expect(argon2.hash).toHaveBeenCalledWith(
        'plain-password',
        expect.objectContaining({
          type: argon2.argon2id,
        }),
      );
    });

    it('debe lanzar InternalServerErrorException si argon2 falla', async () => {
      (argon2.hash as jest.Mock).mockRejectedValue(new Error('argon error'));

      await expect(hasher.hash('plain-password')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('compare()', () => {
    it('debe retornar true si la contraseña coincide', async () => {
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await hasher.compare('plain-password', 'hashed-password');

      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith(
        'hashed-password',
        'plain-password',
      );
    });

    it('debe retornar false si la contraseña no coincide', async () => {
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await hasher.compare('plain-password', 'hashed-password');

      expect(result).toBe(false);
    });

    it('debe lanzar InternalServerErrorException si argon2 falla', async () => {
      (argon2.verify as jest.Mock).mockRejectedValue(new Error('argon error'));

      await expect(
        hasher.compare('plain-password', 'hashed-password'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
