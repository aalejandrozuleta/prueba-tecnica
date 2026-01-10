import { Debt as PrismaDebt } from '@prisma/client';

import { Debt } from '@auth/domain/entities/Debt.entity';
import { DebtStatus } from '@auth/domain/value-objects/DebtStatus.vo';
import { Money } from '@auth/domain/value-objects/Money.vo';

export function mapToDomain(record: PrismaDebt): Debt {
  return Debt.restore({
    id: record.id,
    debtorId: record.debtorId,
    creditorId: record.creditorId,
    amount: new Money(record.amount.toNumber()),
    status: record.status === 'PAID' ? DebtStatus.paid() : DebtStatus.pending(),
    createdAt: record.createdAt,
    paidAt: record.paidAt,
  });
}
