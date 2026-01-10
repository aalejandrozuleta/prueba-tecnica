import { InputHTMLAttributes, useState } from 'react';

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
 * Campo de entrada reutilizable con soporte de error, accesibilidad,
 * modo claro / oscuro y opción de mostrar/ocultar contraseña.
 */
export function Input({
  label,
  error,
  className = '',
  type,
  ...props
}: InputProps) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword && showPassword ? 'text' : type;

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

      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full rounded-lg border px-3 py-2 pr-10 text-sm
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

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              rounded-md p-1
              text-gray-500
              hover:text-gray-700
              transition-colors
              dark:text-gray-400
              dark:hover:text-gray-200
            "
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
