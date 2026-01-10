import { DebtStatus } from './DebtStatus.vo';

describe('DebtStatus Value Object', () => {
  describe('factories', () => {
    it('debe crear un estado PENDING', () => {
      const status = DebtStatus.pending();

      expect(status.getValue()).toBe('PENDING');
      expect(status.isPaid()).toBe(false);
    });

    it('debe crear un estado PAID', () => {
      const status = DebtStatus.paid();

      expect(status.getValue()).toBe('PAID');
      expect(status.isPaid()).toBe(true);
    });
  });

  describe('from()', () => {
    it('debe reconstruir un estado PENDING', () => {
      const status = DebtStatus.from('PENDING');

      expect(status.getValue()).toBe('PENDING');
      expect(status.isPaid()).toBe(false);
    });

    it('debe reconstruir un estado PAID', () => {
      const status = DebtStatus.from('PAID');

      expect(status.getValue()).toBe('PAID');
      expect(status.isPaid()).toBe(true);
    });

    it('debe lanzar error con un valor inválido', () => {
      // Cast intencional para simular input externo inválido
      expect(() => DebtStatus.from('INVALID' as any)).toThrow();
    });
  });
});
