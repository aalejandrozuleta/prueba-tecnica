import { ReactNode } from 'react';

/**
 * Props del componente Text.
 *
 * @property variant Define jerarquía tipográfica.
 */
export interface TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  children: ReactNode;
  className?: string;
}

/**
 * Componente tipográfico base.
 * Centraliza tamaños, pesos y colores.
 */
export function Text({
  variant = 'body',
  children,
  className = '',
}: TextProps) {
  const variants = {
    title: 'text-2xl font-semibold text-gray-900',
    subtitle: 'text-lg font-medium text-gray-800',
    body: 'text-sm text-gray-700',
    caption: 'text-xs text-gray-500',
  };

  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
}
