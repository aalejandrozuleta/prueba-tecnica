/**
 * Payload para actualizar una deuda existente.
 */
export interface UpdateDebtPayload {
  id: string;
  amount: number;
  description: string;
  status: 'PENDING';
}
