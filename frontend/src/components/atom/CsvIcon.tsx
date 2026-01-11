'use client';

import { exportDebts } from '@/services/debts.service';
import { downloadFile } from '@/utils/downloadFile';

/**
 * Botón para exportar deudas en CSV.
 */
export default function CsvIcon() {
  const handleExport = async () => {
    try {
      const blob = await exportDebts();

      downloadFile(blob, 'debts.csv');
    } catch (error) {
      console.error('Error al exportar CSV', error);
    }
  };

  return (
    <figure className="flex items-end justify-end gap-4 px-6 py-5 text-sm">
      <button
        type="button"
        onClick={handleExport}
        className="
          inline-flex items-center gap-2
          rounded-lg px-3 py-2
          text-neutral-700
          bg-white/80 backdrop-blur
          shadow-sm ring-1 ring-black/5
          hover:bg-white
          transition
          dark:bg-neutral-900/80
          dark:text-neutral-200
          dark:ring-white/10
        "
        aria-label="Exportar CSV"
      >
        <Icon />
        CSV
      </button>
    </figure>
  );
}


function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </svg>
  );
}
