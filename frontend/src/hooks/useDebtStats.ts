import { useEffect, useState } from 'react';
import { getDebtStats } from '@/services/debts.service';
import { useToast } from '@/hooks/useToast';

/**
 * Estructura de las estadísticas de deuda.
 */
export interface DebtStats {
  success: boolean;
  data: {
    totalDebts: number;
    totalPaidDebts: number;
    totalPendingDebts: number;
    totalDebtAmount: number;
  }
}

/**
 * Hook encargado de obtener las estadísticas de deuda
 * al montar el componente.
 */
export function useDebtStats() {
  const [data, setData] = useState<DebtStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDebtStats();
        setData(response
        );
      } catch {
        toast.error('No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []); // ✅ SIN dependencias

  return {
    data,
    loading,
  };
}
