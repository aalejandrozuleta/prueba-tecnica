import { Email } from '../value-objects/Email.vo';
import { HashedPassword } from '../value-objects/HashedPassword.vo';
import { UserId } from '../value-objects/UserId.vo';

/**
 * Entidad de dominio que representa un usuario del sistema.
 *
 * @remarks
 * Esta entidad pertenece al núcleo del dominio y encapsula la información
 * esencial de un usuario, así como el acceso controlado a sus propiedades.
 * No depende de frameworks ni de infraestructura externa.
 */
export class User {
  /**
   * Crea una nueva instancia de la entidad `User`.
   *
   * @remarks
   * El constructor es utilizado internamente por la entidad y por los
   * métodos factory para garantizar la creación controlada del usuario.
   *
   * @param id
   * Identificador único del usuario representado como Value Object.
   *
   * @param name
   * Nombre del usuario.
   *
   * @param email
   * Correo electrónico del usuario como Value Object.
   *
   * @param password
   * Contraseña del usuario representada como Value Object con hashing seguro.
   */
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private password: HashedPassword,
  ) {}

  /**
   * Obtiene el identificador del usuario.
   *
   * @returns
   * El identificador único del usuario en formato string.
   */
  getId(): string {
    return this.id.getValue();
  }

  /**
   * Obtiene el correo electrónico del usuario.
   *
   * @returns
   * El correo electrónico en formato string.
   */
  getEmail(): string {
    return this.email.getValue();
  }

  /**
   * Obtiene el nombre del usuario.
   *
   * @returns
   * El nombre del usuario.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Obtiene la contraseña del usuario en su forma hasheada.
   *
   * @remarks
   * Este método retorna únicamente el hash de la contraseña, nunca
   * la contraseña en texto plano.
   *
   * @returns
   * Hash de la contraseña del usuario.
   */
  getPassword(): string {
    return this.password.getValue();
  }

  /**
   * Factory para crear un nuevo usuario.
   *
   * @remarks
   * Este método encapsula la lógica de creación del usuario y garantiza
   * la generación de un identificador único mediante el Value Object `UserId`.
   *
   * @param props
   * Propiedades necesarias para crear el usuario.
   *
   * @returns
   * Una nueva instancia de la entidad `User`.
   */
  static create(props: { name: string; email: Email; password: HashedPassword }): User {
    return new User(UserId.create(), props.name, props.email, props.password);
  }
}
