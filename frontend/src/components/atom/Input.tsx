import { InputHTMLAttributes } from 'react';

/**
 * Props del componente Input.
 *
 * @property label Texto descriptivo del campo.
 * @property error Mensaje de error a mostrar.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Campo de entrada reutilizable con soporte de error, accesibilidad
 * y compatibilidad con modo claro / oscuro.
 */
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className="
            text-sm font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
          {label}
        </label>
      )}

      <input
        className={`
          rounded-lg border px-3 py-2 text-sm
          bg-white text-gray-900
          transition-colors
          placeholder:text-gray-400
          focus:outline-none focus:ring-2

          dark:bg-gray-900
          dark:text-gray-100
          dark:placeholder:text-gray-500

          ${
            error
              ? `
                border-red-500
                focus:ring-red-400
                dark:border-red-400
                dark:focus:ring-red-500
              `
              : `
                border-gray-300
                focus:ring-blue-500
                dark:border-gray-700
                dark:focus:ring-blue-400
              `
          }

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${className}
        `}
        {...props}
      />

      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
