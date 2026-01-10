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
 * Estados válidos de una deuda
 */
export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

/**
 * DTO para la creación de una deuda
 */
export class CreateDebtDto {
  /**
   * Monto de la deuda
   * - Decimal(10,2) en base de datos
   * - Debe ser un número positivo
   */
  @IsNumber({ maxDecimalPlaces: 2 }, { message: i18nValidationMessage('debt.invalid.amount') })
  @IsPositive({ message: i18nValidationMessage('debt.positive.amount') })
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.amount') })
  amount!: number;

  /**
   * Descripción opcional de la deuda
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('debt.invalid.description') })
  @MaxLength(255, {
    message: i18nValidationMessage('debt.max.description'),
  })
  description?: string;

  /**
   * Estado de la deuda
   * - PENDING | PAID
   * - Por defecto PENDING en la BD
   */
  @IsOptional()
  @IsEnum(DebtStatus, {
    message: i18nValidationMessage('debt.invalid.status'),
  })
  status?: DebtStatus;

  /**
   * ID del usuario deudor
   */
  @IsUUID('4', {
    message: i18nValidationMessage('debt.invalid.debtorId'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('debt.required.debtorId'),
  })
  debtorId!: string;

  /**
   * ID del usuario acreedor
   */
  @IsUUID('4', {
    message: i18nValidationMessage('debt.invalid.creditorId'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('debt.required.creditorId'),
  })
  creditorId!: string;
}
