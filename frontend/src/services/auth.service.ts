import { httpClient } from './http.client';

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  return httpClient.post<void>('/user/register', payload);
}


/**
 * Inicia sesión del usuario.
 * El token se gestiona por cookie httpOnly.
 */
export function loginUser(payload: LoginPayload) {
  return httpClient.post<void>('/auth/login', payload);
}
