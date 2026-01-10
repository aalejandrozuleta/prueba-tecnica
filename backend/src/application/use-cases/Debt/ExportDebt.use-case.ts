import { Inject, Injectable } from '@nestjs/common';

import { DEBT_REPOSITORY } from '@auth/application/tokens/debt-repository.token';
import { DebtRepository } from '@auth/domain/repositories/Debt.repository';

/**
 * Caso de uso encargado de exportar deudas en formato CSV.
 *
 * @remarks
 * - No maneja HTTP ni headers.
 * - Convierte entidades de dominio en una representación CSV plana.
 * - El resultado es un string listo para descarga o almacenamiento.
 */
@Injectable()
export class ExportDebtCsvUseCase {
  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: DebtRepository,
  ) {}

  /**
   * Ejecuta la exportación de deudas de un usuario en formato CSV.
   *
   * @param userId
   * Identificador del usuario deudor.
   *
   * @returns
   * Contenido CSV como string.
   */
  async execute(userId: string): Promise<string> {
    const debts = await this.debtRepository.findDebtsByUserId(userId);

    /**
     * Cabeceras del CSV
     */
    const headers = [
      'id',
      'amount',
      'status',
      'description',
      'creditorId',
      'createdAt',
      'paidAt',
    ];

    /**
     * Filas del CSV
     */
    const rows = debts.map((debt) => [
      debt.getId(),
      debt.getAmount(),
      debt.getStatus(),
      debt.getDescription() ?? '',
      debt.getCreditorId(),
      debt.getCreatedAt().toISOString(),
      debt.getPaidAt()?.toISOString() ?? '',
    ]);

    /**
     * Serialización CSV
     */
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map(this.escapeCsvValue).join(','),
      ),
    ].join('\n');

    return csv;
  }

  /**
   * Escapa valores CSV para evitar errores con comas, saltos de línea o comillas.
   *
   * @param value
   * Valor a escapar.
   */
  private escapeCsvValue(value: string | number): string {
    const stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}
