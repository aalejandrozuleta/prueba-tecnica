import { UserId } from './UserId.vo';

describe('UserId Value Object', () => {
  describe('create()', () => {
    it('debe crear un UserId válido', () => {
      const userId = UserId.create();

      expect(userId.getValue()).toBeDefined();
      expect(typeof userId.getValue()).toBe('string');
      expect(userId.getValue().length).toBeGreaterThan(0);
    });

    it('debe generar identificadores distintos en cada creación', () => {
      const id1 = UserId.create().getValue();
      const id2 = UserId.create().getValue();

      expect(id1).not.toBe(id2);
    });
  });

  describe('fromString()', () => {
    it('debe reconstruir un UserId desde un string válido', () => {
      const value = 'user-id-123';

      const userId = UserId.fromString(value);

      expect(userId.getValue()).toBe(value);
    });

    it('debe lanzar error si el id es vacío', () => {
      expect(() => UserId.fromString('')).toThrow();
    });
  });
});
