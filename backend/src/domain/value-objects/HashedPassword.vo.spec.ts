import { HashedPassword } from './HashedPassword.vo';

describe('HashedPassword Value Object', () => {
  const validHash = '$2b$10$hashed-password-example';

  describe('creación válida', () => {
    it('debe crear un HashedPassword usando create()', () => {
      const password = HashedPassword.create(validHash);

      expect(password.getValue()).toBe(validHash);
    });

    it('debe crear un HashedPassword usando fromHash()', () => {
      const password = HashedPassword.fromHash(validHash);

      expect(password.getValue()).toBe(validHash);
    });

    it('debe crear un HashedPassword usando restore()', () => {
      const password = HashedPassword.restore(validHash);

      expect(password.getValue()).toBe(validHash);
    });
  });

  describe('creación inválida', () => {
    it('debe lanzar error si el hash es vacío (create)', () => {
      expect(() => HashedPassword.create('')).toThrow();
    });

    it('debe lanzar error si el hash es vacío (fromHash)', () => {
      expect(() => HashedPassword.fromHash('')).toThrow();
    });

    it('debe lanzar error si el hash es vacío (restore)', () => {
      expect(() => HashedPassword.restore('')).toThrow();
    });
  });
});
