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
 * Enumeración que define los estados válidos de una deuda.
 *
 * @remarks
 * Este enum se utiliza tanto a nivel de validación como de persistencia
 * para garantizar consistencia entre la capa de aplicación y la base de datos.
 */
export enum DebtStatus {
  /**
   * La deuda está pendiente de pago.
   */
  PENDING = 'PENDING',

  /**
   * La deuda ya ha sido pagada.
   */
  PAID = 'PAID',
}

/**
 * DTO utilizado para la creación de una deuda.
 *
 * @remarks
 * Este objeto se valida mediante `class-validator` antes de llegar
 * a la capa de aplicación. Los mensajes de error están internacionalizados
 * usando `nestjs-i18n`.
 */
export class CreateDebtDto {
  /**
   * Monto total de la deuda.
   *
   * @remarks
   * - Se almacena como `Decimal(10,2)` en la base de datos.
   * - Solo se permiten valores positivos.
   * - Máximo dos decimales.
   *
   * @example
   * 1500.75
   */
  @IsNumber({ maxDecimalPlaces: 2 }, { message: i18nValidationMessage('debt.invalid.amount') })
  @IsPositive({ message: i18nValidationMessage('debt.positiveAmount') })
  @IsNotEmpty({ message: i18nValidationMessage('debt.requiredAmount') })
  amount!: number;

  /**
   * Descripción opcional de la deuda.
   *
   * @remarks
   * Se utiliza para agregar contexto adicional sobre el origen
   * o motivo de la deuda. No debe exceder los 255 caracteres.
   *
   * @example
   * "Préstamo personal de enero"
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('debt.invalid.description') })
  @MaxLength(255, {
    message: i18nValidationMessage('debt.max.description'),
  })
  description?: string;

  /**
   * Estado actual de la deuda.
   *
   * @remarks
   * - Valores permitidos: `PENDING` | `PAID`
   * - Si no se envía, la base de datos asigna `PENDING` por defecto.
   */
  @IsOptional()
  @IsEnum(DebtStatus, {
    message: i18nValidationMessage('debt.invalid.status'),
  })
  status?: DebtStatus;

  /**
   * Identificador del usuario deudor.
   *
   * @remarks
   * Este campo suele ser inyectado desde el contexto de autenticación
   * (por ejemplo, el usuario logueado) y no necesariamente desde el body.
   */
  debtorId!: string;

  /**
   * Identificador del usuario acreedor.
   *
   * @remarks
   * Debe ser un UUID v4 válido y corresponde al usuario que recibirá el pago
   * de la deuda.
   */
  @IsUUID('4', {
    message: i18nValidationMessage('debt.invalid.creditorId'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('debt.required.creditorId'),
  })
  creditorId!: string;
}
