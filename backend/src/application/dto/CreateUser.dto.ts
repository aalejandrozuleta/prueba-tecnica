import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * DTO utilizado para la creación de un usuario.
 *
 * @remarks
 * Este DTO valida los datos de entrada necesarios para registrar un nuevo usuario
 * en el sistema. Todas las validaciones se ejecutan antes de alcanzar la capa
 * de dominio o persistencia. Los mensajes de error están internacionalizados
 * mediante `nestjs-i18n`.
 */
export class CreateUserDto {
  /**
   * Dirección de correo electrónico del usuario.
   *
   * @remarks
   * - Debe ser un email válido según RFC.
   * - Es obligatorio y único dentro del sistema.
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
   * Debe cumplir con las siguientes reglas:
   * - Entre 8 y 50 caracteres.
   * - Al menos una letra mayúscula.
   * - Al menos una letra minúscula.
   * - Al menos un número.
   * - Al menos un carácter especial.
   *
   * Esta validación ayuda a cumplir con políticas básicas de seguridad.
   */
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message: i18nValidationMessage('user.validateGeneral.passwordInvalid'),
  })
  password!: string;

  /**
   * Nombre del usuario.
   *
   * @remarks
   * - Campo opcional.
   * - Si se envía, debe tener entre 2 y 50 caracteres.
   * - No se permiten valores vacíos cuando está presente.
   *
   * @example
   * "Alejandro"
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('user.required.name') })
  @MaxLength(50, { message: i18nValidationMessage('user.validateGeneral.nameMax') })
  @MinLength(2, { message: i18nValidationMessage('user.validateGeneral.nameMin') })
  name!: string;
}
