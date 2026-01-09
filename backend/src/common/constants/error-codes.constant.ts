/**
 * Códigos de error estándar de la aplicación.
 */
export const ERROR_CODES = {
  INTERNAL_ERROR: 'errors.internal',
  VALIDATION_ERROR: 'errors.validation',
  UNAUTHORIZED: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',
  NOT_FOUND: 'errors.not_found',
} as const;

export type ErrorCode =
  (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
