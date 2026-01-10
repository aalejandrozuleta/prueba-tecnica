import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';
import { DomainException } from './DomainException';

/**
 * Error de dominio: email ya existe
 */
export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(ERROR_CODES.USER_EMAIL_ALREADY_EXISTS, { email });
  }
}
