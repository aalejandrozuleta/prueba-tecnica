import { Inject, Injectable } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso encargado del pago de una deuda.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y coordina la
 * validación de existencia de la deuda, la ejecución de la operación
 * de pago y la invalidación de la caché relacionada. Mantiene el
 * desacoplamiento mediante puertos e inyección de dependencias,
 * conforme a una arquitectura limpia o hexagonal.
 */
@Injectable()
export class PayDebtUseCase {
  /**
   * Crea una nueva instancia del caso de uso `PayDebtUseCase`.
   *
   * @param debtRepository
   * Repositorio de dominio utilizado para consultar y actualizar
   * el estado de las deudas.
   *
   * @param debtCache
   * Servicio de caché responsable de invalidar información
   * relacionada con deudas.
   */
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  /**
   * Ejecuta el caso de uso para marcar una deuda como pagada.
   *
   * @remarks
   * El flujo incluye:
   * - Verificación de existencia de la deuda.
   * - Ejecución de la operación de pago mediante el repositorio.
   * - Invalidación de la caché asociada al usuario.
   *
   * @param id
   * Identificador único de la deuda a pagar.
   *
   * @param userId
   * Identificador del usuario que ejecuta la operación, utilizado
   * para invalidar la caché correspondiente.
   *
   * @returns
   * Un objeto que indica el éxito de la operación y el identificador
   * de la deuda procesada.
   *
   * @throws
   * Excepciones de dominio cuando la deuda no existe.
   */
  async execute(id: string, userId: string): Promise<{ success: boolean; id: string }> {
    /**
     * Obtiene la deuda por su identificador.
     */
    const debt = await this.debtRepository.findById(id);

    if (!debt) {
      throw ExceptionFactory.debtNotFound(id);
    }

    /**
     * Marca la deuda como pagada e invalida la caché relacionada.
     */
    await this.debtRepository.pay(id);
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);

    return { success: true, id };
  }
}
