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
 * Campo de entrada reutilizable con soporte de error y accesibilidad.
 */
export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={`
          rounded-lg border px-3 py-2 text-sm
          focus:outline-none focus:ring-2
          ${error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-300 focus:ring-blue-500'}
          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
}
