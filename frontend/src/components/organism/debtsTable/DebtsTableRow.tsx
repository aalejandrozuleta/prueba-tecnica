'use client';

import { RowActions } from '@/components/atom/RowActions';
import { DebtViewModel } from '@/types/debt.view-model';
import { StatusBadge } from './StatusBadge';

interface DebtsTableRowProps {
  debt: DebtViewModel;
  onView: (debt: DebtViewModel) => void;
  onDelete: (id: string) => void;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
}

export function DebtsTableRow({
  debt,
  onView,
  onDelete,
  onPay,
  onEdit,
}: DebtsTableRowProps) {
  return (
    <tr className="group transition-all duration-200 hover:bg-black/3 dark:hover:bg-white/4">
      <Cell>
        <span className="font-semibold dark:text-neutral-300">${debt.amount}</span>
      </Cell>

      <Cell>
        <StatusBadge status={debt.status} />
      </Cell>

      <Cell className="text-neutral-500">
        {debt.createdAt}
      </Cell>

      <Cell align="right">
        <RowActions
          onView={() => onView(debt)}
          onEdit={() => onEdit(debt.id)}
          onDelete={() => onDelete(debt.id)}
          onPay={() => onPay(debt.id)}
          disabledPay={debt.status === 'PAID'}
          disabledEdit={debt.status === 'PAID'}
        />
      </Cell>
    </tr>
  );
}

function Cell({
  children,
  align,
  className,
}: {
  children: React.ReactNode;
  align?: 'right';
  className?: string;
}) {
  return (
    <td
      className={`px-6 py-5 ${
        align === 'right' ? 'text-right' : ''
      } ${className ?? ''}`}
    >
      {children}
    </td>
  );
}
