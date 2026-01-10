/**
 * DTO utilizado para la actualización de una deuda existente.
 *
 * @remarks
 * Este DTO valida los datos necesarios para modificar una deuda previamente
 * creada. Permite actualizar atributos específicos como el monto, el estado
 * o la descripción, manteniendo la integridad de los datos antes de llegar
 * a la capa de aplicación o persistencia.
 */

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * Enumeración que define los estados válidos para una deuda.
 *
 * @remarks
 * Se utiliza para restringir los valores permitidos durante la
 * actualización del estado de una deuda.
 */
export enum DebtStatusEnum {
  /**
   * La deuda se encuentra pendiente de pago.
   */
  PENDING = 'PENDING',

  /**
   * La deuda ha sido saldada.
   */
  PAID = 'PAID',
}

/**
 * DTO para la actualización de una deuda.
 *
 * @remarks
 * El identificador de la deuda es obligatorio. El resto de los campos
 * son opcionales y solo se actualizarán si son proporcionados.
 */
export class UpdateDebtDto {
  /**
   * Identificador único de la deuda.
   *
   * @remarks
   * - Debe ser un UUID v4 válido.
   * - Permite identificar de forma inequívoca la deuda a modificar.
   *
   * @example
   * "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.id') })
  @IsString({ message: i18nValidationMessage('debt.invalid.id') })
  @IsUUID('4', { message: i18nValidationMessage('debt.invalid.id') })
  id!: string;

  /**
   * Nuevo monto de la deuda.
   *
   * @remarks
   * - Se persiste como `Decimal(10,2)` en la base de datos.
   * - Debe ser un número positivo.
   * - Solo se actualiza si el valor es proporcionado.
   *
   * @example
   * 2500.50
   */
  @IsNumber({ maxDecimalPlaces: 2 }, { message: i18nValidationMessage('debt.invalid.amount') })
  @IsPositive({ message: i18nValidationMessage('debt.positiveAmount') })
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.amount') })
  amount?: number;

  /**
   * Nuevo estado de la deuda.
   *
   * @remarks
   * - Valores permitidos: `PENDING` | `PAID`.
   * - Si no se envía, el estado no se modifica.
   */
  @IsOptional()
  @IsEnum(DebtStatusEnum, {
    message: i18nValidationMessage('debt.invalid.status'),
  })
  status?: DebtStatusEnum;

  /**
   * Nueva descripción de la deuda.
   *
   * @remarks
   * Campo opcional utilizado para actualizar información descriptiva
   * adicional. No debe exceder los 255 caracteres.
   *
   * @example
   * "Actualización del monto acordado"
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('debt.invalid.description') })
  @MaxLength(255, {
    message: i18nValidationMessage('debt.max.description'),
  })
  description?: string;
}
