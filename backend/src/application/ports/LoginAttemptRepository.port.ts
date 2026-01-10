/**
 * Puerto para el manejo de intentos de inicio de sesión.
 *
 * @remarks
 * Esta interfaz define el contrato para el control de intentos fallidos de login,
 * permitiendo implementar mecanismos de protección contra ataques de fuerza bruta.
 * Forma parte de la capa de aplicación dentro de una arquitectura limpia o hexagonal
 * y abstrae la lógica de bloqueo respecto a la infraestructura utilizada
 * (Redis, base de datos, memoria, etc.).
 */
export interface LoginAttemptRepository {
  /**
   * Verifica si un intento de inicio de sesión se encuentra bloqueado.
   *
   * @param email
   * Correo electrónico utilizado en el intento de autenticación.
   *
   * @param ip
   * Dirección IP desde la cual se realiza el intento.
   *
   * @returns
   * `true` si el intento está bloqueado; de lo contrario, `false`.
   */
  isBlocked(email: string, ip: string): Promise<boolean>;

  /**
   * Incrementa el contador de intentos fallidos de inicio de sesión.
   *
   * @remarks
   * Este método suele invocarse después de un intento fallido de autenticación
   * y puede ser utilizado para determinar cuándo aplicar un bloqueo.
   *
   * @param email
   * Correo electrónico utilizado en el intento de autenticación.
   *
   * @param ip
   * Dirección IP desde la cual se realiza el intento.
   *
   * @returns
   * El número total de intentos fallidos acumulados.
   */
  increment(email: string, ip: string): Promise<number>;

  /**
   * Reinicia el contador de intentos fallidos.
   *
   * @remarks
   * Normalmente se ejecuta tras un inicio de sesión exitoso para limpiar
   * cualquier registro previo de fallos.
   *
   * @param email
   * Correo electrónico asociado a los intentos.
   *
   * @param ip
   * Dirección IP desde la cual se realizaron los intentos.
   */
  reset(email: string, ip: string): Promise<void>;

  /**
   * Bloquea temporalmente los intentos de inicio de sesión.
   *
   * @remarks
   * El bloqueo se aplica por un tiempo determinado y evita nuevos intentos
   * de autenticación durante ese período.
   *
   * @param email
   * Correo electrónico a bloquear.
   *
   * @param ip
   * Dirección IP desde la cual se originaron los intentos.
   *
   * @param ttlSeconds
   * Tiempo de bloqueo expresado en segundos.
   */
  block(email: string, ip: string, ttlSeconds: number): Promise<void>;
}
