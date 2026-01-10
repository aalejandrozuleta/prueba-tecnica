import { Inject, Injectable } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class PayDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  async execute(id: string, userId: string): Promise<{ success: boolean; id: string }> {
    const debt = await this.debtRepository.findById(id);

    if (!debt) {
      throw ExceptionFactory.debtNotFound(id);
    }

    await this.debtRepository.pay(id);
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);
    return { success: true, id };
  }
}
