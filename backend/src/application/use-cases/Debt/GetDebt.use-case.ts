import { Inject, Injectable } from '@nestjs/common';
import { Debt } from '@prisma/client';

import { PaginatedResult } from '@auth/application/dto/Pagination.dto';
import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DEBT_CACHE } from '@auth/application/tokens/debtCache.token';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';
import { DebtCacheService } from '@auth/infrastructure/cache/debt-cache.service';

/**
 * Caso de uso encargado de la obtención paginada de deudas.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y se encarga de
 * recuperar las deudas asociadas a un usuario de forma paginada.
 * Implementa una estrategia de caché para optimizar el rendimiento
 * y reducir el acceso innecesario a la capa de persistencia.
 */
@Injectable()
export class GetDebtUseCase {
  /**
   * Crea una nueva instancia del caso de uso `GetDebtUseCase`.
   *
   * @param debtRepository
   * Repositorio de dominio utilizado para consultar deudas paginadas
   * asociadas a un usuario.
   *
   * @param debtCache
   * Servicio de caché utilizado para almacenar y recuperar resultados
   * paginados de deudas.
   */
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
    @Inject(DEBT_CACHE)
    private readonly debtCache: DebtCacheService,
  ) {}

  /**
   * Ejecuta el caso de uso para obtener deudas de un usuario de forma paginada.
   *
   * @remarks
   * El flujo incluye:
   * - Construcción de una clave de caché basada en usuario y parámetros de paginación.
   * - Recuperación del resultado desde caché si existe.
   * - Consulta al repositorio en caso de no existir caché.
   * - Almacenamiento del resultado en caché para futuras solicitudes.
   *
   * @param userId
   * Identificador del usuario propietario de las deudas.
   *
   * @param page
   * Número de página a consultar.
   *
   * @param limit
   * Cantidad máxima de registros por página.
   *
   * @returns
   * Un resultado paginado que contiene las deudas del usuario y
   * la información de paginación asociada.
   */
  async execute(userId: string, page: number, limit: number) {
    /**
     * Clave única de caché basada en usuario y parámetros de paginación.
     */
    const cacheKey = `debts:${userId}:page:${page}:limit:${limit}`;

    /**
     * Intenta obtener el resultado desde la caché.
     */
    const cached = await this.debtCache.get<PaginatedResult<Debt>>(cacheKey);
    if (cached) {
      return cached;
    }

    /**
     * Consulta las deudas paginadas desde el repositorio de dominio.
     */
    const result = await this.debtRepository.findPaginatedByUser(userId, page, limit);

    /**
     * Almacena el resultado en caché para futuras consultas.
     */
    await this.debtCache.set(cacheKey, result);

    return result;
  }
}
