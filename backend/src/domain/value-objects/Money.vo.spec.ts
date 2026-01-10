import { Money } from './Money.vo';

describe('Money Value Object', () => {
  describe('creación válida', () => {
    it('debe crear un monto válido', () => {
      const money = new Money(100);

      expect(money.getValue()).toBe(100);
    });

    it('debe aceptar valores decimales válidos', () => {
      const money = new Money(99.99);

      expect(money.getValue()).toBe(99.99);
    });
  });

  describe('creación inválida', () => {
    it('debe lanzar excepción si el valor es cero', () => {
      expect(() => new Money(0)).toThrow();
    });

    it('debe lanzar excepción si el valor es negativo', () => {
      expect(() => new Money(-10)).toThrow();
    });

    it('debe lanzar excepción si el valor es NaN', () => {
      expect(() => new Money(Number.NaN)).toThrow();
    });

    it('debe lanzar excepción si el valor es Infinity', () => {
      expect(() => new Money(Number.POSITIVE_INFINITY)).toThrow();
    });
  });
});
