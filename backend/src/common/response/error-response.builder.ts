import { ErrorCode } from '../constants/error-codes.constant';

/**
 * Respuesta estándar de error.
 */
export interface ErrorResponse {
  /** Mensaje de error legible para el cliente */
  message: string;

  /** Código de error de dominio */
  code: ErrorCode;

  /** Información adicional opcional */
  details?: unknown;
}

/**
 * Construye una respuesta de error estándar.
 *
 * @param params Parámetros de construcción del error
 * @returns Objeto de respuesta de error
 */
export function buildErrorResponse(params: {
  message: string;
  code: ErrorCode;
  details?: unknown;
}): ErrorResponse {
  return {
    message: params.message,
    code: params.code,
    ...(params.details !== undefined ? { details: params.details } : {}),
  };
}
