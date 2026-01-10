import { sanitize } from './sanitize.util';

/**
 * Respuesta estándar de éxito.
 */
export interface SuccessResponse<T> {
  message: string;
  data?: T;
}

/**
 * Crea una función para construir respuestas exitosas,
 * desacoplada del entorno y de NestJS.
 */
export function createSuccessResponseBuilder(options: { sanitizeData: boolean }) {
  return function buildSuccessResponse<T extends object>(
    message: string,
    data?: T | T[],
  ): SuccessResponse<T> {
    const safeData = options.sanitizeData && data ? sanitize(data) : data;

    return {
      message,
      ...(safeData !== undefined ? { data: safeData as T } : {}),
    };
  };
}
