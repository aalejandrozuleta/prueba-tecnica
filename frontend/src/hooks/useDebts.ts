import { useEffect, useState, useCallback } from 'react';
import { getDebts } from '@/services/debts.service';
import { mapDebtToViewModel } from '@/adapter/mapDebtToViewModel';
import { DebtViewModel } from '@/types/debt.view-model';

/**
 * Hook para manejo de deudas con paginación backend-driven.
 *
 * - Centraliza la carga de datos
 * - Expone refetch manual
 * - Evita llamadas duplicadas
 *
 * @param initialPage Página inicial
 * @param initialLimit Límite por página
 */
export function useDebts(
  initialPage = 1,
  initialLimit = 10,
) {
  const [data, setData] = useState<DebtViewModel[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Obtiene las deudas desde el backend.
   */
  const fetchDebts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getDebts({ page, limit });

      setData(
        response.data.map(mapDebtToViewModel),
      );
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  /**
   * Carga inicial y recarga al cambiar página o límite.
   */
  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return {
    data,
    page,
    total,
    limit,
    loading,
    setPage,
    refetch: fetchDebts,
  };
}
