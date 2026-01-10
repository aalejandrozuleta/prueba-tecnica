import { Debt } from '../entities/Debt.entity';

export interface DebtRepository {
  findByDebtorId(debtorId: string): Promise<boolean>;
  findByCreditorId(creditorId: string): Promise<boolean>;
  save(data: Debt): Promise<Debt>;
  countActiveByDebtor(debtorId: string): Promise<number>;
  findDebtsByUserId(userId: string): Promise<Debt[]>;
  findById(id: string): Promise<Debt | null>;
}
