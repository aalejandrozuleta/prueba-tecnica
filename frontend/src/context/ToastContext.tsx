'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

/**
 * Tipos de toast soportados por el sistema.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Estructura interna de un Toast.
 */
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Contrato del contexto de Toasts.
 */
interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Proveedor global de Toasts.
 * Debe envolverse en el layout principal de la aplicación.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /**
   * Muestra un nuevo toast.
   */
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  /**
   * Elimina un toast por ID.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook interno para consumir el contexto.
 */
export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }

  return context;
}
