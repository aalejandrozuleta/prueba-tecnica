/**
 * Usuario autenticado extraído del token
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  sessionId: string;
}
