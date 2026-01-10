import { Inject, Injectable } from '@nestjs/common';

import { LoginUserDto } from '@auth/application/dto/LoginUser.dto';
import { AuthSessionService } from '@auth/application/ports/AuthSessionService.port';
import { LoginAttemptRepository } from '@auth/application/ports/LoginAttemptRepository.port';
import { PasswordHasher } from '@auth/application/ports/PasswordHasher.port';
import { AUTH_SESSION_SERVICE } from '@auth/application/tokens/auth-session.token';
import { LOGIN_ATTEMPT_REPOSITORY } from '@auth/application/tokens/login-attempt.token';
import { PASSWORD_HASHER } from '@auth/application/tokens/password-hasher.token';
import { USER_REPOSITORY } from '@auth/application/tokens/user-repository.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';
import { UserRepository } from '@auth/domain/repositories/User.repository';
import { Email } from '@auth/domain/value-objects/Email.vo';

/**
 * Caso de uso encargado del inicio de sesión de un usuario.
 *
 * @remarks
 * Este caso de uso pertenece a la capa de aplicación y coordina el proceso
 * completo de autenticación, incluyendo:
 * - Control de intentos fallidos y bloqueo temporal.
 * - Validación de credenciales.
 * - Creación de sesión y emisión de tokens.
 *
 * Se apoya en puertos para desacoplar la lógica de autenticación de los
 * mecanismos concretos de persistencia, hashing y manejo de sesiones,
 * siguiendo una arquitectura limpia o hexagonal.
 */
@Injectable()
export class LoginUserUseCase {
  /**
   * Crea una nueva instancia del caso de uso `LoginUserUseCase`.
   *
   * @param passwordHasher
   * Servicio encargado de comparar contraseñas en texto plano con hashes
   * previamente almacenados.
   *
   * @param userRepository
   * Repositorio de dominio utilizado para consultar usuarios.
   *
   * @param loginAttempts
   * Repositorio encargado de controlar y limitar los intentos de inicio
   * de sesión fallidos.
   *
   * @param authSessionService
   * Servicio responsable de la creación y gestión de sesiones y tokens
   * de autenticación.
   */
  constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(LOGIN_ATTEMPT_REPOSITORY)
    private readonly loginAttempts: LoginAttemptRepository,

    @Inject(AUTH_SESSION_SERVICE)
    private readonly authSessionService: AuthSessionService,
  ) {}

  /**
   * Ejecuta el caso de uso para autenticar a un usuario.
   *
   * @remarks
   * El flujo incluye:
   * - Verificación de bloqueo por intentos fallidos.
   * - Búsqueda del usuario por correo electrónico.
   * - Validación de la contraseña.
   * - Incremento y bloqueo de intentos fallidos cuando aplica.
   * - Reinicio del contador tras autenticación exitosa.
   * - Creación de una nueva sesión y emisión de tokens.
   *
   * @param dto
   * Objeto de transferencia de datos que contiene las credenciales
   * del usuario.
   *
   * @param ip
   * Dirección IP desde la cual se realiza el intento de inicio de sesión.
   *
   * @returns
   * Un objeto que contiene el token de acceso y el token de actualización.
   *
   * @throws
   * Excepciones de dominio cuando la cuenta está bloqueada o las
   * credenciales son inválidas.
   */
  async execute(
    dto: LoginUserDto,
    ip: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    /**
     * Verifica si la cuenta se encuentra bloqueada para el email e IP dados.
     */
    if (await this.loginAttempts.isBlocked(dto.email, ip)) {
      throw ExceptionFactory.accountBlocked(900);
    }

    /**
     * Construye el value object del correo electrónico.
     */
    const email = new Email(dto.email);

    /**
     * Busca el usuario por correo electrónico.
     */
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      await this.loginAttempts.increment(dto.email, ip);
      throw ExceptionFactory.invalidCredentials();
    }

    /**
     * Valida la contraseña proporcionada contra el hash almacenado.
     */
    const valid = await this.passwordHasher.compare(dto.password, user.getPassword());

    if (!valid) {
      const attempts = await this.loginAttempts.increment(dto.email, ip);
      if (attempts >= 3) {
        await this.loginAttempts.block(dto.email, ip, 900);
      }
      throw ExceptionFactory.invalidCredentials();
    }

    /**
     * Reinicia el contador de intentos tras un inicio de sesión exitoso.
     */
    await this.loginAttempts.reset(email.getValue(), ip);

    /**
     * Crea la sesión de autenticación y retorna los tokens.
     */
    return this.authSessionService.createSession(
      user.getId(),
      user.getEmail(),
      user.getName(),
    );
  }
}
