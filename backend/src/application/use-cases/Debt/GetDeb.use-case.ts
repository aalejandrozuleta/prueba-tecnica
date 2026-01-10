import { Inject, Injectable } from '@nestjs/common';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class GetDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
  ) {}

  async execute(id: string): Promise<Debt[]> {
    const debt = await this.debtRepository.findDebtsByUserId(id);
    return debt;
  }
}