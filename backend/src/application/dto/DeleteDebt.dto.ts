import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * DTO utilizado para la eliminación de una deuda.
 *
 * @remarks
 * Este DTO se emplea para validar la solicitud de eliminación de una deuda
 * específica. Garantiza que el identificador proporcionado sea válido antes
 * de ejecutar cualquier operación de borrado en la capa de persistencia.
 */
export class DeleteDebtDto {
  /**
   * Identificador único de la deuda.
   *
   * @remarks
   * - Debe ser un UUID v4 válido.
   * - Es obligatorio para poder identificar la deuda a eliminar.
   *
   * @example
   * "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.id') })
  @IsString({ message: i18nValidationMessage('debt.invalid.id') })
  @IsUUID('4', { message: i18nValidationMessage('debt.invalid.id') })
  id!: string;
}
