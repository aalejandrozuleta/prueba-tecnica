import { useEffect, useState } from 'react';
import { getDebts } from '@/services/debts.service';
import { mapDebtToViewModel } from '@/adapter/mapDebtToViewModel';
import { DebtViewModel } from '@/types/debt.view-model';

/**
 * Hook para manejo de deudas con paginación backend-driven.
 *
 * @param initialPage Página inicial
 * @param initialLimit Límite por página (default: 10)
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

  useEffect(() => {
    setLoading(true);

    getDebts({ page, limit })
      .then((response) => {
        setData(
          response.data.map(mapDebtToViewModel),
        );
        setTotal(response.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit]);

  return {
    data,
    page,
    total,
    limit,
    loading,
    setPage,
  };
}
