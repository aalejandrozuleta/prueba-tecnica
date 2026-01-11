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
  updateDebt,
} from '@/services/debts.service';
import { CreateDebtPayload } from '@/types/createDebtPayload';
import { UpdateDebtPayload } from '@/types/UpdateDebtPayload';
import CsvIcon from '@/components/atom/CsvIcon';

/**
 * Página principal del dashboard de deudas.
 */
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

  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [openCreate, setOpenCreate] =
    useState(false);

  /**
   * Deuda seleccionada para edición.
   * Si existe, el modal de edición está abierto.
   */
  const [selectedDebt, setSelectedDebt] =
    useState<UpdateDebtPayload | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

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
   * Abre el modal de edición.
   * No permite editar deudas pagadas.
   */
  const handleEdit = (debt: any) => {
    if (debt.status === 'PAID') {
      error('No se puede editar una deuda ya pagada');
      return;
    }

    setSelectedDebt({
      id: debt,
      amount: debt.amount,
      description: debt.description,
      status: debt.status,
    });

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

  /**
   * Submit del modal de edición.
   */
  const handleSubmitEdit = async (
    data: UpdateDebtPayload,
  ) => {
    try {
      await updateDebt(data);
      success('Deuda actualizada correctamente');
      
      setSelectedDebt(null); // 👈 cierra el modal
      refetch();
    } catch (err: any) {
      error(err.error.message);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <ConfigModal />

      {/* Modal crear */}
      <CreateDebtModal
        isOpen={openCreate}
        mode="create"
        onClose={() => setOpenCreate(false)}
        onSubmit={handleSubmitCreate}
      />

      {/* Modal editar (derivado de selectedDebt) */}
      {selectedDebt && (
        <CreateDebtModal
          isOpen={true}
          mode="edit"
          initialData={selectedDebt}
          onClose={() => setSelectedDebt(null)}
          onSubmit={handleSubmitEdit}
        />
      )}

      <div className="space-y-6">
        <h1 className="text-xl font-semibold">
          Deudas
        </h1>

        <div className="flex justify-end w-full gap-5">
          <Button onClick={handleCreate}>
            Crear nueva
          </Button>
          <CsvIcon />
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
