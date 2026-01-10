import { ErrorCode } from '../constants/error-codes.constant';

/**
 * Respuesta estándar de error.
 */
export interface ErrorResponse {
  message: string;
  code: ErrorCode;
  details?: unknown;
}

/**
 * Construye una respuesta de error estándar.
 */
export function buildErrorResponse(params: {
  message: string;
  code: ErrorCode;
  details?: unknown;
}): ErrorResponse {
  return {
    message: params.message,
    code: params.code,
    ...(params.details ? { details: params.details } : {}),
  };
}
