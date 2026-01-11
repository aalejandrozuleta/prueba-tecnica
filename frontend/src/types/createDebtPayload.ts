/**
 * Payload para crear una deuda desde el frontend.
 *
 * IMPORTANTE:
 * - status SIEMPRE es PENDING
 * - debtorId se resuelve en backend (usuario autenticado)
 */
export interface CreateDebtPayload {
  amount: number;
  description?: string;
  creditorId: string;
  status: 'PENDING';
}
