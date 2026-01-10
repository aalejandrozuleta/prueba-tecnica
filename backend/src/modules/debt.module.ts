import { Module } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { CreateDebtUseCase } from '@auth/application/use-cases/Debt/Create.use-case';
import { DeleteDebtUseCase } from '@auth/application/use-cases/Debt/DeleteDebt.use-case';
import { GetDebtUseCase } from '@auth/application/use-cases/Debt/GetDebt.use-case';
import { PayDebtUseCase } from '@auth/application/use-cases/Debt/PayDebt.use-case';
import { UpdateDebtUseCase } from '@auth/application/use-cases/Debt/UpdateDebt.use-case';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';
import { DebtController } from '@auth/infrastructure/controllers/Debt.controller';
import { PrismaDebtRepository } from '@auth/infrastructure/prisma/PrismaDebtRepository';

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
    PayDebtUseCase,

    {
      provide: DEBT_CACHE,
      useClass: DebtCacheService,
    },

    {
      provide: DEBT_REPOSITORY,
      useClass: PrismaDebtRepository,
    },
  ],
})
export class DebtModule {}
