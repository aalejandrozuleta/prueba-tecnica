/**
 * Puerto para manejo de intentos de login
 */
export interface LoginAttemptRepository {
  isBlocked(email: string, ip: string): Promise<boolean>;
  increment(email: string, ip: string): Promise<number>;
  reset(email: string, ip: string): Promise<void>;
  block(email: string, ip: string, ttlSeconds: number): Promise<void>;
}
