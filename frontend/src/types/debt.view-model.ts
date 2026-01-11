/**
 * Modelo de vista para la UI.
 *
 * SOLO valores primitivos.
 */
export interface DebtViewModel {
  id: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  createdAt: string;
}
