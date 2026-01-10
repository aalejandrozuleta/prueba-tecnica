/**
 * DTO para actualizar una deuda existente
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

export enum DebtStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export class UpdateDebtDto {
  /** ID de la deuda */
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.id') })
  @IsString({ message: i18nValidationMessage('debt.invalid.id') })
  @IsUUID('4', { message: i18nValidationMessage('debt.invalid.id') })
  id!: string;

  /**
   * Monto de la deuda
   * - Decimal(10,2) en base de datos
   * - Debe ser un número positivo
   */
  @IsNumber({ maxDecimalPlaces: 2 }, { message: i18nValidationMessage('debt.invalid.amount') })
  @IsPositive({ message: i18nValidationMessage('debt.positiveAmount') })
  @IsNotEmpty({ message: i18nValidationMessage('debt.required.amount') })
  amount?: number;

  /**
   * Estado de la deuda
   * - PENDING | PAID
   * - Por defecto PENDING en la BD
   */
  @IsOptional()
  @IsEnum(DebtStatusEnum, {
    message: i18nValidationMessage('debt.invalid.status'),
  })
  status?: DebtStatusEnum;

  /**
   * Descripción opcional de la deuda
   */
  @IsOptional()
  @IsString({ message: i18nValidationMessage('debt.invalid.description') })
  @MaxLength(255, {
    message: i18nValidationMessage('debt.max.description'),
  })
  description?: string;
}
