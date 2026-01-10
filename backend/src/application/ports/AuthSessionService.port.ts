/**
 * Puerto para el manejo de sesiones y tokens de autenticación.
 *
 * @remarks
 * Esta interfaz define el contrato que deben implementar los adaptadores
 * encargados de la creación, renovación y revocación de sesiones de usuario.
 * Forma parte de la capa de aplicación dentro de una arquitectura limpia
 * o hexagonal, permitiendo desacoplar la lógica de autenticación de la
 * infraestructura concreta (JWT, Redis, base de datos, etc.).
 */
export interface AuthSessionService {
  /**
   * Crea una nueva sesión de autenticación para un usuario.
   *
   * @param userId
   * Identificador único del usuario.
   *
   * @param email
   * Correo electrónico del usuario autenticado.
   *
   * @param name
   * Nombre del usuario, si está disponible.
   *
   * @returns
   * Un objeto que contiene los tokens de acceso y de actualización.
   */
  createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{
    /**
     * Token de acceso utilizado para autorizar las solicitudes protegidas.
     */
    accessToken: string;

    /**
     * Token de actualización utilizado para obtener un nuevo token de acceso.
     */
    refreshToken: string;
  }>;

  /**
   * Renueva un token de acceso a partir de un token de actualización válido.
   *
   * @param refreshToken
   * Token de actualización previamente emitido.
   *
   * @returns
   * Un nuevo token de acceso.
   */
  refresh(refreshToken: string): Promise<string>;

  /**
   * Revoca una sesión activa.
   *
   * @remarks
   * Una vez revocada, los tokens asociados a la sesión dejan de ser válidos
   * y no podrán utilizarse para autenticación.
   *
   * @param sessionId
   * Identificador único de la sesión a revocar.
   */
  revokeSession(sessionId: string): Promise<void>;
}
