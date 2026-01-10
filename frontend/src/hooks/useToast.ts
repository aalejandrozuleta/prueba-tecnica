import { useToastContext } from '@/context/ToastContext';

/**
 * Hook público para mostrar mensajes Toast.
 *
 * Uso:
 * const { success, error, info, warning } = useToast();
 */
export function useToast() {
  const { showToast } = useToastContext();

  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),
  };
}
