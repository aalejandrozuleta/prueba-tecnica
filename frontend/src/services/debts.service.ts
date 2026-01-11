import { PaginatedResponse } from '@/types/paginated-response';
import { httpClient } from './http.client';
import { DebtDto } from '@/types/debt.dto';
import { CreateDebtPayload } from '@/types/createDebtPayload';
import { DebtStats } from '@/hooks/useDebtStats';

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


/**
 * Crea una nueva deuda.
 *
 * - debtorId se resuelve en backend
 * - status SIEMPRE es PENDING
 */
export async function createDebt(
  payload: CreateDebtPayload,
): Promise<DebtDto> {
  return httpClient.post<DebtDto>(
    '/debt/create',
    payload,
  );
}

export async function updateDebt(id: string, payload: Omit<DebtDto, 'id'>) {
  return httpClient.put<DebtDto>(`/debt/${id}`, payload);
}

/**
 * Exporta las deudas en formato CSV.
 */
export async function exportDebts(): Promise<Blob> {
  return httpClient.get<Blob>('/debt/export', {
    responseType: 'blob',
  });
}

export async function getDebtStats(): Promise<DebtStats> {
  const  data  = await httpClient.get<DebtStats>('/debt/count');
  return data;
}