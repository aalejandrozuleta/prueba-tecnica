import { Inject, Injectable } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso encargado de la eliminación de una deuda.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y coordina la validación
 * de existencia de la deuda, su eliminación a través del repositorio de dominio
 * y la invalidación de la caché relacionada. Mantiene el desacoplamiento
 * mediante puertos e inyección de dependencias, acorde a una arquitectura
 * limpia o hexagonal.
 */
@Injectable()
export class DeleteDebtUseCase {
  /**
   * Crea una nueva instancia del caso de uso `DeleteDebtUseCase`.
   *
   * @param debtRepository
   * Repositorio de dominio utilizado para consultar y eliminar deudas.
   *
   * @param debtCache
   * Servicio de caché responsable de invalidar entradas relacionadas
   * con listados de deudas.
   */
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  /**
   * Ejecuta el caso de uso para eliminar una deuda existente.
   *
   * @remarks
   * El flujo incluye:
   * - Búsqueda de la deuda por su identificador.
   * - Lanzamiento de una excepción de dominio si la deuda no existe.
   * - Eliminación de la deuda mediante el repositorio.
   * - Invalidación de la caché asociada al usuario.
   *
   * @param id
   * Identificador único de la deuda a eliminar.
   *
   * @param userId
   * Identificador del usuario que ejecuta la operación, utilizado
   * para invalidar la caché correspondiente.
   *
   * @returns
   * Un objeto que indica el resultado exitoso de la operación y el
   * identificador de la deuda eliminada.
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
     * Elimina la deuda y limpia la caché asociada.
     */
    await this.debtRepository.delete(debt);
    await this.debtCache.invalidateByPattern(`debts:${userId}:page:*`);

    return { success: true, id };
  }
}
