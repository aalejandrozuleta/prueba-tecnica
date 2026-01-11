import { PaginatedResult } from '@auth/application/dto/Pagination.dto';

import { Debt } from '../entities/Debt.entity';
import { DebtorDebtStats } from '@auth/utils/DebtorDebtStats.interface';

export interface DebtRepository {
  findByDebtorId(debtorId: string): Promise<boolean>;
  findByCreditorId(creditorId: string): Promise<boolean>;
  save(data: Debt): Promise<Debt>;
  getDebtStatsByDebtor(debtorId: string): Promise<DebtorDebtStats>;
  countActiveByDebtor(debtorId: string): Promise<number>;
  findDebtsByUserId(userId: string): Promise<Debt[]>;
  findById(id: string): Promise<Debt | null>;
  delete(debt: Debt): Promise<void>;
  pay(id: string): Promise<void>;
  findPaginatedByUser(userId: string, page: number, limit: number): Promise<PaginatedResult<Debt>>;
}
