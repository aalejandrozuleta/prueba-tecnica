'use client';

import { DebtViewModel } from '@/types/debt.view-model';
import { DebtsTableRow } from './DebtsTableRow';
import { EmptyRow } from './EmptyRow';

interface DebtsTableBodyProps {
  debts: DebtViewModel[];
  loading: boolean;
  onView: (debt: DebtViewModel) => void;
  onDelete: (id: string) => void;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
}

export function DebtsTableBody({
  debts,
  loading,
  onView,
  onDelete,
  onPay,
  onEdit,
}: DebtsTableBodyProps) {
  if (loading) {
    return (
      <tbody>
        <EmptyRow colSpan={4}>Cargando…</EmptyRow>
      </tbody>
    );
  }

  if (debts.length === 0) {
    return (
      <tbody>
        <EmptyRow colSpan={4}>
          No hay deudas registradas
        </EmptyRow>
      </tbody>
    );
  }

  return (
    <tbody>
      {debts.map((debt) => (
        <DebtsTableRow
          key={debt.id}
          debt={debt}
          onView={onView}
          onDelete={onDelete}
          onPay={onPay}
          onEdit={onEdit}
        />
      ))}
    </tbody>
  );
}
