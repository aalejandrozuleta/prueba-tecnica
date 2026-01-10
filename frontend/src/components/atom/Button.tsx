import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Props base para el componente Button.
 *
 * @property variant Define el estilo visual del botón.
 * @property isLoading Muestra un spinner y deshabilita el botón.
 * @property children Contenido interno del botón.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  isLoading?: boolean;
  children: ReactNode;
}

/**
 * Botón reutilizable con soporte de estados y variantes.
 * Diseñado para mantener consistencia visual y UX.
 */
export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const disabledStyles = 'opacity-60 cursor-not-allowed';

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${(disabled || isLoading) && disabledStyles}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
}
