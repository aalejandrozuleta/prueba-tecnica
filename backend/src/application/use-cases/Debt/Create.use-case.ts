import { Inject, Injectable } from '@nestjs/common';

import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { Money } from '@auth/domain/value-objects/Money.vo';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class CreateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  async execute(dto: CreateDebtDto, userId: string): Promise<Debt> {
    const existDebtor = await this.debtRepository.findByDebtorId(dto.debtorId);
    if (!existDebtor) {
      throw ExceptionFactory.debtorNotFound(dto.debtorId);
    }

    const existCreditor = await this.debtRepository.findByCreditorId(dto.creditorId);
    if (!existCreditor) {
      throw ExceptionFactory.creditorNotFound(dto.creditorId);
    }

    /**
     * Regla de negocio:
     * un deudor no puede tener más de 3 deudas activas
     */
    const activeDebts = await this.debtRepository.countActiveByDebtor(dto.debtorId);

    if (activeDebts >= 10) {
      throw ExceptionFactory.activeDebtLimitExceeded(10);
    }

    /**
     * Construcción del Value Object
     * (protege la invariante del monto)
     */
    const amount = new Money(dto.amount);

    /**
     * Creación de la entidad de dominio
     */
    const debt = Debt.create({
      debtorId: dto.debtorId,
      creditorId: dto.creditorId,
      description: dto.description,
      amount,
    });

    /**
     * Persistencia
     */
    await this.debtRepository.save(debt);
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);

    return debt;
  }
}
