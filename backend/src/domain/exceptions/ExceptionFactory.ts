import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';

import { DomainException } from './DomainException';

/**
 * Fábrica centralizada para la creación de excepciones de dominio.
 *
 * @remarks
 * Esta clase encapsula la construcción de todas las excepciones de dominio
 * utilizadas en la aplicación. Permite:
 * - Centralizar códigos de error y estados HTTP.
 * - Garantizar consistencia semántica en los errores de negocio.
 * - Facilitar la internacionalización mediante claves i18n.
 *
 * Todas las excepciones retornadas son instancias de `DomainException`
 * y representan violaciones explícitas de reglas de negocio.
 */
export class ExceptionFactory {
  /* =========================
   * AUTH / USER
   * ========================= */

  /**
   * Credenciales inválidas.
   *
   * @remarks
   * Se utiliza cuando el email o la contraseña no coinciden con
   * los registros del sistema.
   */
  static invalidCredentials(): DomainException {
    return new DomainException({
      code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      status: 401,
      i18nKey: 'common.auth.invalid_credentials',
    });
  }

  /**
   * Cuenta bloqueada temporalmente por múltiples intentos fallidos.
   *
   * @param minutes
   * Cantidad de minutos durante los cuales la cuenta permanecerá bloqueada.
   */
  static accountBlocked(minutes: number): DomainException {
    return new DomainException({
      code: ERROR_CODES.AUTH_ACCOUNT_BLOCKED,
      status: 423,
      i18nKey: 'common.auth.account_blocked',
      i18nArgs: { minutes },
    });
  }

  /**
   * El correo electrónico ya se encuentra registrado.
   *
   * @param email
   * Correo electrónico que intentó registrarse.
   */
  static emailAlreadyExists(email: string): DomainException {
    return new DomainException({
      code: ERROR_CODES.USER_EMAIL_ALREADY_EXISTS,
      status: 409,
      i18nKey: 'common.errors.user_email_already_exists',
      i18nArgs: { email },
    });
  }

  /**
   * Token de actualización inválido.
   *
   * @remarks
   * Se utiliza cuando el refresh token no es válido, está corrupto
   * o no existe en el sistema.
   */
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
   * Monto de deuda inválido.
   *
   * @remarks
   * Representa una violación de las reglas asociadas al valor monetario
   * de una deuda.
   */
  static invalidDebtAmount(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_INVALID_AMOUNT,
      status: 400,
      i18nKey: 'debt.invalid.amount',
    });
  }

  /**
   * El deudor y el acreedor son el mismo usuario.
   *
   * @remarks
   * No se permite crear una deuda donde ambas partes sean iguales.
   */
  static sameDebtorAndCreditor(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_SAME_DEBTOR_AND_CREDITOR,
      status: 400,
      i18nKey: 'debt.same_debtor_and_creditor',
    });
  }

  /**
   * Intento de pagar una deuda que ya se encuentra pagada.
   */
  static debtAlreadyPaid(): DomainException {
    return new DomainException({
      code: ERROR_CODES.DEBT_ALREADY_PAID,
      status: 409,
      i18nKey: 'debt.already_paid',
    });
  }

  /**
   * El deudor ha superado el límite permitido de deudas activas.
   *
   * @param max
   * Número máximo de deudas activas permitidas.
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
   * Deudor no encontrado.
   *
   * @param debtorId
   * Identificador del deudor buscado.
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
   * Acreedor no encontrado.
   *
   * @param creditorId
   * Identificador del acreedor buscado.
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
   * Deuda no encontrada.
   *
   * @param id
   * Identificador de la deuda buscada.
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
   * Error de autorización.
   *
   * @remarks
   * Se utiliza cuando el usuario no tiene permisos válidos
   * para realizar una operación.
   */
  static unauthorized(): DomainException {
    return new DomainException({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
      i18nKey: 'common.auth.unauthorized',
    });
  }

  /**
   * Sesión expirada o inválida.
   *
   * @remarks
   * Representa errores relacionados con expiración de tokens
   * o sesiones inválidas.
   */
  static sessionExpired(): DomainException {
    return new DomainException({
      code: ERROR_CODES.SESSION_EXPIRED,
      status: 401,
      i18nKey: 'common.auth.token_expired',
    });
  }
}
