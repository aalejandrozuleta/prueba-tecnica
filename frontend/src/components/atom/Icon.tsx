import { ReactNode } from 'react';

/**
 * Props del componente Icon.
 *
 * @property children SVG o icono a renderizar.
 */
export interface IconProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper para iconos SVG.
 * Permite estandarizar tamaño, color y animaciones.
 */
export function Icon({ children, className = '' }: IconProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {children}
    </span>
  );
}
