import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';

import { DomainException } from './DomainException';

/**
 * Factory centralizada para excepciones del dominio
 */
export class ExceptionFactory {
  /* =========================
   * AUTH / USER
   * ========================= */

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

  /* =========================
   * DEBT DOMAIN
   * ========================= */

  /**
   * Monto de deuda inválido
   */
  static invalidDebtAmount(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_INVALID_AMOUNT,
      status: 400,
      i18nKey: 'debt.invalid.amount',
    });
  }

  /**
   * Deudor y acreedor son el mismo usuario
   */
  static sameDebtorAndCreditor(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_SAME_DEBTOR_AND_CREDITOR,
      status: 400,
      i18nKey: 'debt.same_debtor_and_creditor',
    });
  }

  /**
   * Intento de pagar una deuda ya pagada
   */
  static debtAlreadyPaid(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_ALREADY_PAID,
      status: 409,
      i18nKey: 'debt.already_paid',
    });
  }

  /**
   * El deudor superó el límite de deudas activas
   */
  static activeDebtLimitExceeded(max: number): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_ACTIVE_LIMIT_EXCEEDED,
      status: 409,
      i18nKey: 'debt.active_limit_exceeded',
      i18nArgs: { max },
    });
  }

  /**
   * Deudor no encontrado
   */
  static debtorNotFound(debtorId: string): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBTOR_NOT_FOUND,
      status: 404,
      i18nKey: 'debt.debtor_not_found',
      i18nArgs: { debtorId },
    });
  }

  /**
   * Acreedor no encontrado
   */
  static creditorNotFound(creditorId: string): DomainException {
    return new DomainException({
      code: ERROR_CODES.CREDITOR_NOT_FOUND,
      status: 404,
      i18nKey: 'debt.creditor_not_found',
      i18nArgs: { creditorId },
    });
  }

  /**
   * Debt no encontrado
   */
  static debtNotFound(id: string): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_NOT_FOUND,
      status: 404,
      i18nKey: 'debt.debt_not_found',
      i18nArgs: { id },
    });
  }

  /* =========================
   * GENERIC
   * ========================= */
  
  /**
   * Error en autorización
   * 
   */
  static unauthorized(): DomainException {
    return new DomainException({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
      i18nKey: 'common.auth.unauthorized',
    });
  }

  /**
   * Error en sesión
   * 
   */
  static sessionExpired(): DomainException {
    return new DomainException({
      code: ERROR_CODES.SESSION_EXPIRED,
      status: 401,
      i18nKey: 'common.auth.token_expired',
    });
  }
}
