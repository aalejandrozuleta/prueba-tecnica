/**
 * Códigos de error estándar de la aplicación.
 */
export const ERROR_CODES = {
  INTERNAL_ERROR: 'common.errors.internal',
  VALIDATION_ERROR: 'common.errors.validation',
  UNAUTHORIZED: 'common.errors.unauthorized',
  FORBIDDEN: 'common.errors.forbidden',
  NOT_FOUND: 'common.errors.not_found',
  USER_EMAIL_ALREADY_EXISTS: 'user.validateGeneral.USER_EMAIL_ALREADY_EXISTS',

} as const;

export type ErrorCode =
  (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
