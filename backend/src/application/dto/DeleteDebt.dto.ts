import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class DeleteDebtDto {
  /** ID de la deuda */
    @IsNotEmpty({ message: i18nValidationMessage('debt.required.id') })
    @IsString({ message: i18nValidationMessage('debt.invalid.id') })
    @IsUUID('4', { message: i18nValidationMessage('debt.invalid.id') })
    id!: string;
}