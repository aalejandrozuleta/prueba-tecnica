import { DEBT_REPOSITORY } from "@auth/application/tokens/debt-repository.token";
import { DebtRepository } from "@auth/domain/repositories/Debt.repository";
import { DebtorDebtStats } from "@auth/utils/DebtorDebtStats.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetDebtsCountUseCase {
  constructor(@Inject(DEBT_REPOSITORY)
  private readonly debtRepository: DebtRepository,) {
  }

  async execute(userId: string): Promise<{ success: boolean; data:DebtorDebtStats }> {
    const data = await this.debtRepository.getDebtStatsByDebtor(userId);
    return { success: true, data: data  };
  }
}