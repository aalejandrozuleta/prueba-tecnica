'use client';

import { ReactNode } from 'react';

/**
 * Props del AuthLayout.
 *
 * @property title Título principal de la pantalla.
 * @property subtitle Texto descriptivo debajo del título.
 * @property children Contenido principal (formularios).
 */
export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Layout base para pantallas de autenticación.
 *
 * Este layout se utiliza en:
 * - Register
 * - Login
 *
 * Responsabilidades:
 * - Centrar el contenido vertical y horizontalmente
 * - Proveer un contenedor visual consistente (card)
 * - Aplicar estilos base y animaciones
 * - Mantener una UX limpia y profesional
 */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main
      className="
        min-h-screen
        flex items-center justify-center
        bg-gray-50 px-4
        transition-colors
        dark:bg-gray-950
      "
    >
      <section
        className="
          w-full max-w-md
          rounded-xl
          bg-white
          border border-gray-200
          p-6
          shadow-sm
          animate-scale-in
          dark:bg-gray-900
          dark:border-gray-600
        "
      >
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </header>

        {/* Content */}
        <div>{children}</div>
      </section>
    </main>
  );
}
