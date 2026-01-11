'use client';

import { useState } from 'react';
import { Button } from '@/components/atom/Button';
import { ConfigModal } from '@/components/organism/ConfigModal';
import { DebtsTable } from '@/components/organism/debtsTable';
import { CreateDebtModal } from '@/components/organism/CreateDebtModal';
import { useDebts } from '@/hooks/useDebts';
import { useToast } from '@/hooks/useToast';
import {
  deleteDebt,
  payDebt,
  createDebt,
} from '@/services/debts.service';
import { useRouter } from 'next/navigation';
import { CreateDebtPayload } from '@/types/createDebtPayload';
import CsvIcon from '@/components/atom/CsvIcon';

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

  const { error, success } = useToast();
  const router = useRouter();

  const [openCreate, setOpenCreate] =
    useState(false);

  /**
   * Elimina una deuda.
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteDebt(id);
      refetch();
    } catch (err: any) {
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
    } catch (err: any) {
      error(err.error.message);
    }
  };

  /**
   * Navega a la edición de la deuda.
   */
  const handleEdit = (id: string) => {
    router.push(`/dashboard/debts/${id}/edit`);
  };

  /**
   * Abre el modal de creación.
   */
  const handleCreate = () => {
    setOpenCreate(true);
  };

  /**
   * Submit del modal de creación.
   */
  const handleSubmitCreate = async (
    data: CreateDebtPayload,
  ) => {
    try {
      await createDebt(data);
      success('Deuda creada correctamente');
      setOpenCreate(false);
      refetch();
    } catch (err: any) {
      error(err.error.message);
    }
  };

  return (
    <>
      <ConfigModal />

      {/* Modal de creación */}
      <CreateDebtModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleSubmitCreate}
      />

      <div className="space-y-6">
        <h1 className="text-xl font-semibold">
          Deudas
        </h1>

        <div className="flex justify-end w-full gap-5">
          <Button onClick={handleCreate}>
            Crear nueva
          </Button>
          <CsvIcon/>
        </div>

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
