import { Inject, Injectable } from '@nestjs/common';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class PayDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
  ) {}

  async execute(id: string): Promise<{ success: boolean, id: string }> {
    const debt = await this.debtRepository.findById(id);
    
    if (!debt) {
      throw ExceptionFactory.debtNotFound(id);
    }

    await this.debtRepository.pay(id);
    return { success: true, id };
    
  }
}