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
