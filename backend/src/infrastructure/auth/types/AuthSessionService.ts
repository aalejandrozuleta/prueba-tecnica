/**
 * Puerto para el manejo de sesiones de autenticación.
 *
 * @remarks
 * Esta interfaz define el contrato mínimo que deben implementar los
 * adaptadores encargados de crear sesiones de usuario y emitir los
 * tokens necesarios para la autenticación. Forma parte de la capa
 * de aplicación dentro de una arquitectura limpia o hexagonal,
 * permitiendo desacoplar la lógica de autenticación de la
 * implementación concreta (JWT, Redis, base de datos, etc.).
 */
export interface AuthSessionService {
  /**
   * Crea una nueva sesión de autenticación para un usuario.
   *
   * @param userId
   * Identificador único del usuario autenticado.
   *
   * @param email
   * Correo electrónico del usuario autenticado.
   *
   * @param name
   * Nombre del usuario, si está disponible.
   *
   * @returns
   * Un objeto que contiene el token de acceso y el token de actualización
   * asociados a la sesión creada.
   */
  createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{
    /**
     * Token de acceso utilizado para autorizar solicitudes protegidas.
     */
    accessToken: string;

    /**
     * Token de actualización utilizado para obtener nuevos tokens
     * de acceso cuando el actual expira.
     */
    refreshToken: string;
  }>;
}
