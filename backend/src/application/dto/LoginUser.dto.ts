import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * DTO utilizado para el inicio de sesión de un usuario.
 *
 * @remarks
 * Este DTO valida las credenciales enviadas durante el proceso de autenticación.
 * Se utiliza en la capa de entrada (controller) antes de delegar la lógica
 * al caso de uso o servicio de autenticación. Los mensajes de error están
 * internacionalizados mediante `nestjs-i18n`.
 */
export class LoginUserDto {
  /**
   * Dirección de correo electrónico del usuario.
   *
   * @remarks
   * - Debe tener un formato de email válido.
   * - Es obligatorio para identificar al usuario durante el login.
   *
   * @example
   * usuario@dominio.com
   */
  @IsEmail()
  @IsNotEmpty({ message: i18nValidationMessage('user.required.email') })
  @IsEmail({}, { message: i18nValidationMessage('user.errors.invalid_email') })
  email!: string;

  /**
   * Contraseña del usuario.
   *
   * @remarks
   * Debe cumplir con las reglas de seguridad definidas:
   * - Entre 8 y 50 caracteres.
   * - Al menos una letra mayúscula.
   * - Al menos una letra minúscula.
   * - Al menos un número.
   * - Al menos un carácter especial.
   *
   * Estas validaciones ayudan a prevenir credenciales débiles.
   */
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message: i18nValidationMessage('user.validateGeneral.passwordInvalid'),
  })
  password!: string;
}
