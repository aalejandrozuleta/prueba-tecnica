/**
 * Props del paginador.
 */
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginación simple.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 text-gray-600 dark:text-gray-200 cursor-pointer"
      >
        ←
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 text-gray-600 dark:text-gray-200 cursor-pointer"
      >
        →
      </button>
    </div>
  );
}
