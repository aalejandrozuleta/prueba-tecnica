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

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: i18nValidationMessage('user.required.email') })
  @IsEmail({}, { message: i18nValidationMessage('user.errors.invalid_email') })
  email!: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message: i18nValidationMessage('user.validateGeneral.passwordInvalid'),
  })
  password!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage('user.required.name') })
  @MaxLength(50, { message: i18nValidationMessage('user.validateGeneral.nameMax') })
  @MinLength(2, { message: i18nValidationMessage('user.validateGeneral.nameMin') })
  name!: string;
}
