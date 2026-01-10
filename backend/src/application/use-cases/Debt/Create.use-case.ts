import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CreateDebtDto } from '@auth/application/dto/CreateDebt.dto';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { Money } from '@auth/domain/value-objects/Money.vo';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';


/**
 * Caso de uso: crear deuda
 */
@Injectable()
export class CreateDebtUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,

  ) { }

  async execute(dto: CreateDebtDto): Promise<Debt> {
    console.log('dto', dto);
    
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
    const activeDebts =
      await this.debtRepository.countActiveByDebtor(dto.debtorId);

    if (activeDebts >= 3) {
      throw ExceptionFactory.activeDebtLimitExceeded(3);
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
    await this.debtRepository.create(debt);

    return debt;
  }
}
