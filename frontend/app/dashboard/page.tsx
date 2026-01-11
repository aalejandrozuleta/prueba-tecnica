'use client';

import { ConfigModal } from '@/components/organism/ConfigModal';
import { DebtsTable } from '@/components/organism/debtsTable';
import { useDebts } from '@/hooks/useDebts';

export default function DashboardPage() {
  const {
    data,
    page,
    total,
    limit,
    loading,
    setPage,
  } = useDebts(1);

  return (
    <>
      <ConfigModal />

      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Deudas</h1>

        <DebtsTable
          debts={data}
          page={page}
          total={total}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onDelete={(id) => console.log('delete', id)}
          onPay={(id) => console.log('pay', id)}
          onEdit={(id) => console.log('edit', id)}
        />
      </div>
    </>
  );
}
