import { mapToDomain } from './debt.mapper';
import { Debt } from '@auth/domain/entities/Debt.entity';

/**
 * Mock mínimo del tipo PrismaDebt.
 * No usamos Prisma real en unit tests.
 */
const createPrismaDebt = (overrides?: Partial<any>) => ({
  id: 'debt-1',
  debtorId: 'debtor-1',
  creditorId: 'creditor-1',
  amount: {
    toNumber: () => 150,
  },
  status: 'PENDING',
  createdAt: new Date('2024-01-01'),
  paidAt: null,
  ...overrides,
});

describe('DebtMapper → mapToDomain', () => {
  it('debe mapear correctamente una deuda PENDING', () => {
    const prismaDebt = createPrismaDebt();

    const debt = mapToDomain(prismaDebt as any);

    expect(debt).toBeInstanceOf(Debt);
    expect(debt.getId()).toBe('debt-1');
    expect(debt.getDebtorId()).toBe('debtor-1');
    expect(debt.getCreditorId()).toBe('creditor-1');
    expect(debt.getAmount()).toBe(150);
    expect(debt.isPaid()).toBe(false);
    expect(debt.getPaidAt()).toBeUndefined();
  });

  it('debe mapear correctamente una deuda PAID', () => {
    const paidAt = new Date('2024-01-02');

    const prismaDebt = createPrismaDebt({
      status: 'PAID',
      paidAt,
    });

    const debt = mapToDomain(prismaDebt as any);

    expect(debt.isPaid()).toBe(true);
    expect(debt.getPaidAt()).toEqual(paidAt);
  });
});
