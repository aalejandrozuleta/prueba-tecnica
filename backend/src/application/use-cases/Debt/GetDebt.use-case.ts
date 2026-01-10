import { Inject, Injectable } from '@nestjs/common';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class GetDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) { }

  async execute(userId: string, page: number, limit: number) {
    const cacheKey = `debts:${userId}:page:${page}:limit:${limit}`;

    const cached = await this.debtCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.debtRepository.findPaginatedByUser(
      userId,
      page,
      limit,
    );

    await this.debtCache.set(cacheKey, result);

    return result;
  }
}