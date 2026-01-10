'use client';

import { useToastContext } from '@/context/ToastContext';

/**
 * Componente visual que renderiza los Toasts activos.
 * Debe renderizarse una sola vez en el layout principal.
 */
export function Toast() {
  const { toasts, removeToast } = useToastContext();

  const variants = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-toast-in
            flex min-w-70 items-center justify-between
            rounded-lg border px-4 py-3 shadow-md
            ${variants[toast.type]}
          `}
        >
          <span className="text-sm font-medium">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-sm font-bold opacity-60 hover:opacity-100"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
