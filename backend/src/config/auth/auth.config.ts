/**
 * Configuración de autenticación y JWT
 */
export const authConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET as string,
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as `${number}${"s" | "m" | "h" | "d"}`,
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET as string,
    expiresInDays: 30,
  },
};
