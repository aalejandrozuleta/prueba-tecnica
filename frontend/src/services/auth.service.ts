import { httpClient } from './http.client';

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser(payload: RegisterPayload) {
  return httpClient.post<void>('/user/register', payload);
}
