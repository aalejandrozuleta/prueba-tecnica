/**
 * Representa al usuario autenticado extraído desde el token JWT.
 *
 * @remarks
 * Esta interfaz define la estructura del payload de autenticación
 * que se adjunta al objeto `request` tras una validación exitosa
 * del token y de la sesión activa.
 *
 * Se utiliza principalmente en:
 * - Guards de autenticación
 * - Decoradores como `@CurrentUser`
 * - Casos de uso y controladores que requieren información del usuario autenticado
 */
export interface AuthUser {
  /**
   * Identificador único del usuario.
   */
  id: string;

  /**
   * Correo electrónico del usuario autenticado.
   */
  email: string;

  /**
   * Nombre del usuario, si está disponible.
   */
  name?: string;

  /**
   * Identificador único de la sesión activa.
   *
   * @remarks
   * Se utiliza para validar la sesión en sistemas externos
   * como Redis y para soportar mecanismos de revocación.
   */
  sessionId: string;
}
