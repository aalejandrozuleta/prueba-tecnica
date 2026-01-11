import { DebtDto } from '@/types/debt.dto';
import { DebtViewModel } from '@/types/debt.view-model';

/**
 * Convierte una deuda del backend a un modelo de vista.
 *
 * ESTE ES EL ÚNICO LUGAR donde se tocan Value Objects.
 */
export function mapDebtToViewModel(
  debt: DebtDto,
): DebtViewModel {
  return {
    id: debt.id,
    amount: debt.amount.value,
    status: debt.status.value,
    createdAt: new Date(debt.createdAt).toLocaleDateString(),
  };
}
