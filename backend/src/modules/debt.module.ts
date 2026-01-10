import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { DebtController } from '@auth/infrastructure/controllers/Debt.controller';
import { PrismaDebtRepository } from '@auth/infrastructure/prisma/PrismaDebtRepository';
import { Module } from '@nestjs/common';


/**
 * Módulo de usuarios
 */
@Module({
  controllers: [DebtController],
  providers: [
    CreateDebtUseCase,

    {
      provide: DEBT_REPOSITORY,
      useClass: PrismaDebtRepository,
    },
  ],
})
export class DebtModule {}

