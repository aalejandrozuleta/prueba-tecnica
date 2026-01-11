import { PaginatedResponse } from '@/types/paginated-response';
import { httpClient } from './http.client';
import { DebtDto } from '@/types/debt.dto';

/**
 * Obtiene deudas paginadas desde el backend.
 *
 * @param params Parámetros de paginación
 */
export function getDebts(params: {
  page: number;
  limit: number;
}) {
  return httpClient.get<PaginatedResponse<DebtDto>>(
    '/debt',
    { params },
  );
}

/**
 * Elimina una deuda enviando el id en el body.
 *
 * @param id Identificador de la deuda
 */
export async function deleteDebt(id: string) {
  return httpClient.delete('/debt', {
    data: { id },
  });
}

export async function payDebt(id: string) {
  return httpClient.post(`/debt/pay`, { id });
}

