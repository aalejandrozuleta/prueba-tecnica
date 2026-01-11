'use client';

import { DebtViewModel } from '@/types/debt.view-model';
import { Modal } from '../shared/Modal';

/**
 * Props del modal de visualización de deuda.
 *
 * IMPORTANTE:
 * - Este componente SOLO acepta DebtViewModel
 * - Nunca debe recibir DTOs de dominio
 */
export interface DebtViewModalProps {
  debt: DebtViewModel | null;
  onClose: () => void;
}

/**
 * Modal informativo para visualizar el detalle de una deuda.
 *
 * Consume datos normalizados listos para UI.
 */
export function DebtViewModal({
  debt,
  onClose,
}: DebtViewModalProps) {
  return (
    <Modal
      isOpen={Boolean(debt)}
      title="Detalle de deuda"
      onClose={onClose}
    >
      {debt && (
        <div className="space-y-4 text-sm">
          <Field label="Monto">${debt.amount}</Field>
          <Field label="Estado">{debt.status}</Field>
          <Field label="Creada">{debt.createdAt}</Field>
        </div>
      )}
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Subcomponentes                               */
/* -------------------------------------------------------------------------- */

/**
 * Campo informativo del modal.
 */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="block text-xs text-gray-500">
        {label}
      </span>
      <p className="font-medium">{children}</p>
    </div>
  );
}
