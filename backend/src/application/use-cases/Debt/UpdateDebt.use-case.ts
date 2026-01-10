import { Inject, Injectable } from '@nestjs/common';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { UpdateDebtDto } from '@auth/application/dto/UpdateDebt.dto';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { Money } from '@auth/domain/value-objects/Money.vo';
import { DebtStatus } from '@auth/domain/value-objects/DebtStatus.vo';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class UpdateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
        private readonly debtCache: DebtCacheService,
  ) { }

  async execute(dto: UpdateDebtDto, userId: string): Promise<Debt> {
    const debt = await this.debtRepository.findById(dto.id);

    if (!debt) {
      throw ExceptionFactory.debtNotFound(dto.id);
    }

    if (debt.getStatus() === 'PAID' ) {
      throw ExceptionFactory.debtAlreadyPaid();
    }


    if (dto.amount !== undefined) {
      debt.updateAmount(new Money(dto.amount));
    }

    if (dto.description !== undefined) {
      debt.updateDescription(dto.description);
    }

    if (dto.status !== undefined) {
        debt.updateStatus(DebtStatus.from(dto.status));

    }

    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);
    return this.debtRepository.save(debt);
  }
}