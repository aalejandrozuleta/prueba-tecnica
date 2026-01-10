import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@auth/application/dto/CreateUser.dto';
import { PasswordHasher } from '@auth/application/ports/PasswordHasher.port';
import { PASSWORD_HASHER } from '@auth/application/tokens/password-hasher.token';
import { USER_REPOSITORY } from '@auth/application/tokens/user-repository.token';
import { User } from '@auth/domain/entities/User.entity';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { UserRepository } from '@auth/domain/repositories/User.repository';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';

/**
 * Caso de uso encargado de la creación de un usuario.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y orquesta el
 * proceso completo de registro de un usuario, incluyendo la validación
 * de unicidad del correo electrónico, el hashing seguro de la contraseña
 * y la creación de la entidad de dominio correspondiente. Mantiene el
 * desacoplamiento mediante puertos e inyección de dependencias, acorde
 * a una arquitectura limpia o hexagonal.
 */
@Injectable()
export class CreateUserUseCase {
  /**
   * Crea una nueva instancia del caso de uso `CreateUserUseCase`.
   *
   * @param userRepository
   * Repositorio de dominio encargado de la persistencia y consulta de usuarios.
   *
   * @param passwordHasher
   * Servicio responsable de aplicar hashing seguro a las contraseñas.
   */
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /**
   * Ejecuta el caso de uso para crear un nuevo usuario.
   *
   * @remarks
   * El flujo incluye:
   * - Creación del value object `Email` para validar el correo electrónico.
   * - Verificación de unicidad del email.
   * - Hashing seguro de la contraseña.
   * - Creación del value object `HashedPassword`.
   * - Construcción de la entidad de dominio `User`.
   * - Persistencia del usuario.
   *
   * @param dto
   * Objeto de transferencia de datos que contiene la información necesaria
   * para crear el usuario.
   *
   * @returns
   * La entidad de dominio `User` recién creada.
   *
   * @throws
   * Excepciones de dominio cuando el correo electrónico ya existe.
   */
  async execute(dto: CreateUserDto): Promise<User> {
    /**
     * Construye el value object del correo electrónico.
     */
    const email = new Email(dto.email);

    /**
     * Verifica si el correo electrónico ya se encuentra registrado.
     */
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw ExceptionFactory.emailAlreadyExists(dto.email);
    }

    /**
     * Genera el hash seguro de la contraseña.
     */
    const hash = await this.passwordHasher.hash(dto.password);
    const password = HashedPassword.create(hash);

    /**
     * Crea la entidad de dominio `User`.
     */
    const user = User.create({
      name: dto.name,
      email,
      password,
    });

    /**
     * Persiste el usuario en el repositorio.
     */
    return this.userRepository.create(user);
  }
}
