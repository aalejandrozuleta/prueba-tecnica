'use client';

import { ReactNode, useEffect } from 'react';

/**
 * Props del componente Modal.
 *
 * @property isOpen Controla si el modal está visible.
 * @property onClose Función que se ejecuta al cerrar el modal.
 * @property title Título opcional del modal.
 * @property children Contenido interno del modal.
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/**
 * Componente Modal base reutilizable.
 *
 * - Bloquea el fondo cuando está activo
 * - Permite cierre por overlay, botón o tecla ESC
 * - Soporta dark / light mode
 * - Incluye animaciones suaves
 *
 * Este componente debe usarse como base para:
 * - Modales de configuración
 * - Confirmaciones
 * - Ventanas informativas
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  /**
   * Maneja el cierre del modal al presionar la tecla ESC.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className="
          relative z-10 w-full max-w-md
          rounded-xl bg-white p-6 shadow-xl
          transition-all duration-300
          animate-scale-in
          dark:bg-gray-900
        "
      >
        {/* Header */}
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>

            <button
              onClick={onClose}
              className="
                rounded-md p-1 text-gray-500
                hover:bg-gray-100 hover:text-gray-700
                transition-colors
                dark:hover:bg-gray-800 dark:text-gray-400
              "
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
}
