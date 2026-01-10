/**
 * Puerto para manejo de sesiones y tokens
 */
export interface AuthSessionService {
  createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  refresh(refreshToken: string): Promise<string>;
  revokeSession(sessionId: string): Promise<void>;
}
