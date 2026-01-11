/**
 * Value Object serializado para montos.
 */
export interface MoneyDto {
  value: number;
}

/**
 * Value Object serializado para estado de deuda.
 */
export interface DebtStatusDto {
  value: 'PAID' | 'PENDING';
}

/**
 * DTO de deuda tal como lo entrega la API.
 */
export interface DebtDto {
  id: string;
  debtorId: string;
  creditorId: string;
  amount: MoneyDto;
  status: DebtStatusDto;
  createdAt: string;
}
