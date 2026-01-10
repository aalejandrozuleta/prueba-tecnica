import { ERROR_CODES } from '@auth/common/constants/error-codes.constant';
import { DomainException } from '../exceptions/DomainException';

/**
 * Value Object Email
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new DomainException({
        code: ERROR_CODES.VALIDATION_ERROR,
        status: 400,
        i18nKey: 'errors.user.invalid_email',
      });
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
