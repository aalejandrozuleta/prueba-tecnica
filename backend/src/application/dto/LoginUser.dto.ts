import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty({ message: i18nValidationMessage('user.required.email') })
  @IsEmail({}, { message: i18nValidationMessage('user.errors.invalid_email') })
  email!: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,50}$/, {
    message: i18nValidationMessage('user.validateGeneral.passwordInvalid'),
  })
  password!: string;
}
