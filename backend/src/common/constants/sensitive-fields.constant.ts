/**
 * Lista de propiedades sensibles que no deben exponerse al cliente.
 */
export const SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'recoveryCode',
  'internalId',
] as const;
