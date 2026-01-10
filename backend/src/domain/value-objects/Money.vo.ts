import { ExceptionFactory } from '../exceptions/ExceptionFactory';

/**
 * Value Object que representa una cantidad monetaria válida
 */
export class Money {
  constructor(private readonly value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      throw ExceptionFactory.invalidDebtAmount();
    }
  }

  /**
   * Retorna el valor numérico del dinero
   */
  getValue(): number {
    return this.value;
  }
}
