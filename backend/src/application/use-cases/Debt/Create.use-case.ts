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
 * Caso de uso encargado de la creación de una deuda.
 *
 * @remarks
 * Esta clase representa un caso de uso de la capa de aplicación dentro de una
 * arquitectura limpia o hexagonal. Orquesta las validaciones de negocio,
 * la creación de la entidad de dominio y su persistencia, manteniendo
 * desacopladas las dependencias mediante puertos e inyección de dependencias.
 */
@Injectable()
export class CreateDebtUseCase {
  /**
   * Crea una nueva instancia del caso de uso `CreateDebtUseCase`.
   *
   * @param debtRepository
   * Repositorio de dominio encargado de la persistencia y consulta de deudas.
   *
   * @param debtCache
   * Servicio de caché utilizado para invalidar datos relacionados con deudas.
   */
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  /**
   * Ejecuta el caso de uso para crear una nueva deuda.
   *
   * @remarks
   * El flujo incluye:
   * - Verificación de existencia del deudor y acreedor.
   * - Validación de reglas de negocio.
   * - Creación de value objects y entidad de dominio.
   * - Persistencia de la deuda.
   * - Invalidación de caché relacionada.
   *
   * @param dto
   * Objeto de transferencia de datos que contiene la información necesaria
   * para crear la deuda.
   *
   * @param userId
   * Identificador del usuario que ejecuta la operación, utilizado para la
   * invalidación de caché.
   *
   * @returns
   * La entidad de dominio `Debt` recién creada.
   *
   * @throws
   * Excepciones de dominio cuando no se cumplen las reglas de negocio
   * o no existen las entidades relacionadas.
   */
  async execute(dto: CreateDebtDto, userId: string): Promise<Debt> {
    /**
     * Verifica la existencia del deudor.
     */
    const existDebtor = await this.debtRepository.findByDebtorId(dto.debtorId);
    if (!existDebtor) {
      throw ExceptionFactory.debtorNotFound(dto.debtorId);
    }

    /**
     * Verifica la existencia del acreedor.
     */
    const existCreditor = await this.debtRepository.findByCreditorId(dto.creditorId);
    if (!existCreditor) {
      throw ExceptionFactory.creditorNotFound(dto.creditorId);
    }

    /**
     * Regla de negocio:
     * un deudor no puede tener más de 3 deudas activas.
     */
    const activeDebts = await this.debtRepository.countActiveByDebtor(dto.debtorId);

    if (activeDebts >= 10) {
      throw ExceptionFactory.activeDebtLimitExceeded(10);
    }

    /**
     * Construcción del Value Object del monto.
     *
     * @remarks
     * El value object `Money` protege las invariantes relacionadas
     * con el valor monetario de la deuda.
     */
    const amount = new Money(dto.amount);

    /**
     * Creación de la entidad de dominio `Debt`.
     */
    const debt = Debt.create({
      debtorId: dto.debtorId,
      creditorId: dto.creditorId,
      description: dto.description,
      amount,
    });

    /**
     * Persistencia de la deuda y limpieza de caché asociada.
     */
    await this.debtRepository.save(debt);
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);

    return debt;
  }
}
