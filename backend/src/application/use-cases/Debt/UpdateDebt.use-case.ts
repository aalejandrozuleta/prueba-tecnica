import { Inject, Injectable } from '@nestjs/common';

import { UpdateDebtDto } from '@auth/application/dto/UpdateDebt.dto';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { Debt } from '@auth/domain/entities/Debt.entity';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtStatus } from '@auth/domain/value-objects/DebtStatus.vo';
import { Money } from '@auth/domain/value-objects/Money.vo';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso encargado de la actualización de una deuda existente.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y coordina la
 * validación de reglas de negocio, la actualización controlada de
 * la entidad de dominio `Debt` y la persistencia de los cambios.
 * Utiliza inyección de dependencias y puertos para mantener el
 * desacoplamiento conforme a una arquitectura limpia o hexagonal.
 */
@Injectable()
export class UpdateDebtUseCase {
  /**
   * Crea una nueva instancia del caso de uso `UpdateDebtUseCase`.
   *
   * @param debtRepository
   * Repositorio de dominio utilizado para consultar y persistir deudas.
   *
   * @param debtCache
   * Servicio de caché responsable de invalidar información relacionada
   * con listados de deudas.
   */
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  /**
   * Ejecuta el caso de uso para actualizar una deuda.
   *
   * @remarks
   * El flujo incluye:
   * - Obtención de la deuda por su identificador.
   * - Validación de existencia de la deuda.
   * - Verificación de reglas de negocio (por ejemplo, no permitir
   *   modificaciones sobre deudas ya pagadas).
   * - Actualización parcial de los atributos permitidos.
   * - Invalidación de la caché asociada al usuario.
   * - Persistencia de los cambios.
   *
   * @param dto
   * Objeto de transferencia de datos que contiene la información
   * a actualizar de la deuda.
   *
   * @param userId
   * Identificador del usuario que ejecuta la operación, utilizado
   * para invalidar la caché correspondiente.
   *
   * @returns
   * La entidad de dominio `Debt` con los cambios aplicados.
   *
   * @throws
   * Excepciones de dominio cuando la deuda no existe o cuando
   * se intenta modificar una deuda ya pagada.
   */
  async execute(dto: UpdateDebtDto, userId: string): Promise<Debt> {
    /**
     * Obtiene la deuda por su identificador.
     */
    const debt = await this.debtRepository.findById(dto.id);

    if (!debt) {
      throw ExceptionFactory.debtNotFound(dto.id);
    }

    /**
     * Regla de negocio:
     * una deuda pagada no puede ser modificada.
     */
    if (debt.getStatus() === 'PAID') {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    /**
     * Actualiza el monto de la deuda si se proporciona.
     */
    if (dto.amount !== undefined) {
      debt.updateAmount(new Money(dto.amount));
    }

    /**
     * Actualiza la descripción de la deuda si se proporciona.
     */
    if (dto.description !== undefined) {
      debt.updateDescription(dto.description);
    }

    /**
     * Actualiza el estado de la deuda si se proporciona.
     */
    if (dto.status !== undefined) {
      debt.updateStatus(DebtStatus.from(dto.status));
    }

    /**
     * Invalida la caché y persiste los cambios.
     */
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);
    return this.debtRepository.save(debt);
  }
}
