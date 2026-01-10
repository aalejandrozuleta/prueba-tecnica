/**
 * Puerto para el manejo de hashing y verificación de contraseñas.
 *
 * @remarks
 * Esta interfaz define el contrato que deben implementar los adaptadores
 * encargados de aplicar algoritmos de hashing seguro a contraseñas y de
 * verificar su validez. Permite desacoplar la lógica de autenticación de
 * la implementación concreta del algoritmo (por ejemplo, bcrypt, argon2).
 * Forma parte de la capa de aplicación en una arquitectura limpia o hexagonal.
 */
export interface PasswordHasher {
  /**
   * Genera un hash seguro a partir de una contraseña en texto plano.
   *
   * @param plain
   * Contraseña en texto plano proporcionada por el usuario.
   *
   * @returns
   * Hash resultante de aplicar el algoritmo de cifrado configurado.
   */
  hash(plain: string): Promise<string>;

  /**
   * Compara una contraseña en texto plano con un hash previamente almacenado.
   *
   * @remarks
   * Este método se utiliza durante el proceso de autenticación para verificar
   * si la contraseña proporcionada coincide con la registrada en el sistema.
   *
   * @param plain
   * Contraseña en texto plano a validar.
   *
   * @param hash
   * Hash previamente almacenado.
   *
   * @returns
   * `true` si la contraseña coincide con el hash; de lo contrario, `false`.
   */
  compare(plain: string, hash: string): Promise<boolean>;
}
