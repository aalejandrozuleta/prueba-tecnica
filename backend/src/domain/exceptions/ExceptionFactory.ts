import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';
import { DomainException } from './DomainException';

/**
 * Factory centralizada para excepciones del dominio
 */
export class ExceptionFactory {

  static invalidCredentials(): DomainException {
    return new DomainException({
      code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      status: 401,
      i18nKey: 'common.auth.invalid_credentials',
    });
  }

  static accountBlocked(minutes: number): DomainException {
    return new DomainException({
      code: ERROR_CODES.AUTH_ACCOUNT_BLOCKED,
      status: 423,
      i18nKey: 'common.auth.account_blocked',
      i18nArgs: { minutes },
    });
  }

  static emailAlreadyExists(email: string): DomainException {
    return new DomainException({
      code: ERROR_CODES.USER_EMAIL_ALREADY_EXISTS,
      status: 409,
      i18nKey: 'common.user.email_already_exists',
      i18nArgs: { email },
    });
  }

  static invalidRefreshToken(): DomainException {
    return new DomainException({
      code: ERROR_CODES.SESSION_INVALID_REFRESH_TOKEN,
      status: 401,
      i18nKey: 'common.session.invalid_refresh_token',
    });
  }
}
