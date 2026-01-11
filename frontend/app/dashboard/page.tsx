'use client';

import { ConfigModal } from '@/components/organism/ConfigModal';
import { DebtsTable } from '@/components/organism/debtsTable';
import { useDebts } from '@/hooks/useDebts';
import { useToast } from '@/hooks/useToast';
import { deleteDebt, payDebt } from '@/services/debts.service';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const {
    data,
    page,
    total,
    limit,
    loading,
    setPage,
    refetch,
  } = useDebts(1);

  const { error } = useToast();
  const router = useRouter();

  /**
   * Elimina una deuda.
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteDebt(id);
      refetch();
    } catch (err:any) {
      error(err.error.message);
    }
  };

  /**
   * Marca una deuda como pagada.
   */
  const handlePay = async (id: string) => {
    try {
      await payDebt(id);
      refetch();
    } catch (err:any) {
      error(err.error.message);
    }
  };

  /**
   * Navega a la edición de la deuda.
   */
  const handleEdit = (id: string) => {
    router.push(`/dashboard/debts/${id}/edit`);
  };

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
          onDelete={handleDelete}
          onPay={handlePay}
          onEdit={handleEdit}
        />
      </div>
    </>
  );
}
