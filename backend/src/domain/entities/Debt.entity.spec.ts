import { Debt } from './Debt.entity';
import { Money } from '../value-objects/Money.vo';
import { DebtStatus } from '../value-objects/DebtStatus.vo';
import { ExceptionFactory } from '../exceptions/ExceptionFactory';

describe('Debt Entity', () => {
  const debtorId = 'debtor-1';
  const creditorId = 'creditor-1';

  const amount = new Money(100);

  describe('create()', () => {
    it('debe crear una deuda válida con estado PENDING', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
        description: 'Test debt',
      });

      expect(debt.getId()).toBeDefined();
      expect(debt.getStatus()).toBe('PENDING');
      expect(debt.getAmount()).toBe(100);
      expect(debt.getCreatedAt()).toBeInstanceOf(Date);
      expect(debt.isPaid()).toBe(false);
    });

    it('debe lanzar excepción si deudor y acreedor son iguales', () => {
      expect(() =>
        Debt.create({
          debtorId,
          creditorId: debtorId,
          amount,
        }),
      ).toThrow(Error)

    });
  });

  describe('pay()', () => {
    it('debe permitir pagar una deuda pendiente', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      debt.pay();

      expect(debt.getStatus()).toBe('PAID');
      expect(debt.isPaid()).toBe(true);
      expect(debt.getPaidAt()).toBeInstanceOf(Date);
    });

    it('debe lanzar excepción si la deuda ya está pagada', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      debt.pay();

      expect(() => debt.pay()).toThrow(
        Error
      );
    });
  });

  describe('updateAmount()', () => {
    it('debe permitir actualizar el monto si la deuda está pendiente', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      const newAmount = new Money(200);

      debt.updateAmount(newAmount);

      expect(debt.getAmount()).toBe(200);
      expect(debt.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('debe lanzar excepción si se intenta actualizar una deuda pagada', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      debt.pay();

      expect(() =>
        debt.updateAmount(new Money(300)),
      ).toThrow(Error);
    });
  });

  describe('updateStatus()', () => {
    it('debe permitir actualizar el estado si la deuda está pendiente', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      debt.updateStatus(DebtStatus.paid());

      expect(debt.getStatus()).toBe('PAID');
      expect(debt.getPaidAt()).toBeInstanceOf(Date);
      expect(debt.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('debe lanzar excepción si la deuda ya está pagada', () => {
      const debt = Debt.create({
        debtorId,
        creditorId,
        amount,
      });

      debt.pay();

      expect(() =>
        debt.updateStatus(DebtStatus.pending()),
      ).toThrow(Error);
    });
  });

  describe('restore()', () => {
    it('debe rehidratar una deuda sin aplicar reglas de negocio', () => {
      const debt = Debt.restore({
        id: 'debt-id',
        debtorId,
        creditorId,
        amount,
        status: DebtStatus.paid(),
        createdAt: new Date(),
        paidAt: new Date(),
      });

      expect(debt.getId()).toBe('debt-id');
      expect(debt.getStatus()).toBe('PAID');
      expect(debt.isPaid()).toBe(true);
    });
  });
});
