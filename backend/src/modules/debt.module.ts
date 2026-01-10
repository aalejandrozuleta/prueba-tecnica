import { Module } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { DebtController } from '@auth/infrastructure/controllers/Debt.controller';
import { PrismaDebtRepository } from '@auth/infrastructure/prisma/PrismaDebtRepository';
import { GetDebtUseCase } from '@auth/application/use-cases/Debt/GetDebt.use-case';
import { UpdateDebtUseCase } from '@auth/application/use-cases/Debt/UpdateDebt.use-case';
import { DeleteDebtUseCase } from '@auth/application/use-cases/Debt/DeleteDebt.use-case';

/**
 * Módulo de usuarios
 */
@Module({
  controllers: [DebtController],
  providers: [
    CreateDebtUseCase,
    GetDebtUseCase,
    UpdateDebtUseCase,
    DeleteDebtUseCase,

    {
      provide: DEBT_REPOSITORY,
      useClass: PrismaDebtRepository,
    },
  ],
})
export class DebtModule { }
