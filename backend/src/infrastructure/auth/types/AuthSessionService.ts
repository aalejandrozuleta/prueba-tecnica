export interface AuthSessionService {
  createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
