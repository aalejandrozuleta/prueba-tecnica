'use client';

interface StatusBadgeProps {
  status: 'PAID' | 'PENDING';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPaid = status === 'PAID';

  return (
    <span
      className={`
        inline-flex items-center gap-1
        rounded-full px-3 py-1 text-xs font-semibold
        ${
          isPaid
            ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300'
            : 'bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300'
        }
      `}
    >
      ● {isPaid ? 'Pagado' : 'Pendiente'}
    </span>
  );
}
