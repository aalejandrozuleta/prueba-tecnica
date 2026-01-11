'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getDebtsTexts } from '@/libs/i18n';

/**
 * Props del componente RowActions.
 */
export interface RowActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPay: () => void;
  disabledPay?: boolean;
}

interface RowActionItem {
  label: string;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
  onPay,
  disabledPay,
}: RowActionsProps) {
  const { language } = useLanguage();
  const texts = getDebtsTexts(language);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const runAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  /**
   * Acciones definidas de forma declarativa,
   * con labels provenientes de i18n.
   */
  const actions: RowActionItem[] = [
    {
      label: texts.actions.view,
      action: onView,
    },
    {
      label: texts.actions.edit,
      action: onEdit,
    },
    {
      label: texts.actions.pay,
      action: onPay,
      disabled: disabledPay,
    },
    {
      label: texts.actions.delete,
      action: onDelete,
      danger: true,
      dividerBefore: true,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          rounded-md p-1.5
          text-neutral-400
          hover:text-neutral-700 hover:bg-black/5
          dark:hover:bg-white/10 dark:hover:text-white
          transition
          cursor-pointer
        "
        aria-label="Acciones"
      >
        ⋮
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-50 mt-1
            w-36
            rounded-lg
            bg-white shadow-lg ring-1 ring-black/5
            dark:bg-neutral-900 dark:ring-white/10
          "
        >
          {actions.map((item, index) => (
            <div key={index}>
              {item.dividerBefore && (
                <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
              )}

              <MenuItem
                label={item.label}
                onClick={() =>
                  runAction(item.action)
                }
                disabled={item.disabled}
                danger={item.danger}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MenuItem({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full px-3 py-1.5 text-left text-xs
        transition
        ${
          danger
            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
            : 'text-neutral-700 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      {label}
    </button>
  );
}
