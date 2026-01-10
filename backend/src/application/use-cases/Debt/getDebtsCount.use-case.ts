import { DEBT_REPOSITORY } from "@auth/application/tokens/debt-repository.token";
import { DebtRepository } from "@auth/domain/repositories/Debt.repository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetDebtsCountUseCase {
  constructor(@Inject(DEBT_REPOSITORY)
  private readonly debtRepository: DebtRepository,) {
  }

  async execute(userId: string): Promise<{ success: boolean; count: number }> {
    const count = await this.debtRepository.countActiveByDebtor(userId);
    return { success: true, count: count };
  }
}