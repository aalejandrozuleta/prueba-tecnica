'use client';

import { useState } from 'react';
import { Pagination } from '@/components/atom/Pagination';
import { DebtViewModal } from '../DebtViewModal';
import { DebtViewModel } from '@/types/debt.view-model';
import { DebtsTableHeader } from './DebtsTableHeader';
import { DebtsTableBody } from './DebtsTableBody';

export interface DebtsTableProps {
  debts: DebtViewModel[];
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
}

export function DebtsTable(props: DebtsTableProps) {
  const {
    debts,
    page,
    total,
    limit,
    loading,
    onPageChange,
    onDelete,
    onPay,
    onEdit,
  } = props;

  const [selectedDebt, setSelectedDebt] =
    useState<DebtViewModel | null>(null);

  const totalPages =
    limit > 0 ? Math.ceil(total / limit) : 1;

  return (
    <>
      <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl dark:bg-neutral-900/70">
        <div className="relative min-h-105 overflow-x-auto">
          <table className="min-w-full text-sm">
            <DebtsTableHeader />

            <DebtsTableBody
              debts={debts}
              loading={loading}
              onView={setSelectedDebt}
              onDelete={onDelete}
              onPay={onPay}
              onEdit={onEdit}
            />
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <DebtViewModal
        debt={selectedDebt}
        onClose={() => setSelectedDebt(null)}
      />
    </>
  );
}
