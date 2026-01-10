import { ExceptionFactory } from '../exceptions/ExceptionFactory';
import { DebtStatus } from '../value-objects/DebtStatus.vo';
import { Money } from '../value-objects/Money.vo';

/**
 * Entidad de dominio que representa una deuda
 */
export class Debt {
  private readonly id: string;
  private readonly createdAt: Date;
  private status: DebtStatus;
  private paidAt?: Date;
  private description?: string;

  private readonly debtorId: string;
  private readonly creditorId: string;
  private amount: Money;
  private updatedAt?: Date;

  /**
   * Constructor interno
   * No contiene reglas de negocio
   */
  private constructor(props: {
    id: string;
    debtorId: string;
    creditorId: string;
    amount: Money;
    status: DebtStatus;
    description?: string;
    createdAt: Date;
    paidAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.debtorId = props.debtorId;
    this.creditorId = props.creditorId;
    this.amount = props.amount;
    this.status = props.status;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.paidAt = props.paidAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Factory para crear una deuda nueva
   */
  static create(props: {
    debtorId: string;
    creditorId: string;
    amount: Money;
    description?: string;
  }): Debt {
    if (props.debtorId === props.creditorId) {
      throw ExceptionFactory.sameDebtorAndCreditor();
    }

    return new Debt({
      id: crypto.randomUUID(),
      debtorId: props.debtorId,
      creditorId: props.creditorId,
      amount: props.amount,
      description: props.description,
      status: DebtStatus.pending(),
      createdAt: new Date(),
    });
  }

  /**
   * Factory para rehidratar desde persistencia
   * NO valida reglas de creación
   */
  static restore(props: {
    id: string;
    debtorId: string;
    creditorId: string;
    amount: Money;
    status: DebtStatus;
    description?: string;
    createdAt: Date;
    paidAt?: Date | null;
  }): Debt {
    return new Debt({
      id: props.id,
      debtorId: props.debtorId,
      creditorId: props.creditorId,
      amount: props.amount,
      status: props.status,
      description: props.description,
      createdAt: props.createdAt,
      paidAt: props.paidAt ?? undefined,
    });
  }

  /**
   * Marca la deuda como pagada
   */
  pay(): void {
    if (this.status.isPaid()) {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    this.status = DebtStatus.paid();
    this.paidAt = new Date();
  }

  /* ===== Getters ===== */

  getId(): string {
    return this.id;
  }

  getAmount(): number {
    return this.amount.getValue();
  }

  getStatus(): 'PENDING' | 'PAID' {
    return this.status.getValue();
  }

  isPaid(): boolean {
    return this.status.isPaid();
  }

  getPaidAt(): Date | undefined {
    return this.paidAt;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getDebtorId(): string {
    return this.debtorId;
  }

  getCreditorId(): string {
    return this.creditorId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  /**
   * Actualiza el monto de la deuda
   */
  updateAmount(amount: Money): void {
    if (this.status.isPaid()) {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    this.amount = amount;
    this.touch();
  }

  /**
   * Actualiza la descripción
   */
  updateDescription(description?: string): void {
    this.description = description;
    this.touch();
  }

  /**
   * Cambia el estado de la deuda
   */
  updateStatus(status: DebtStatus): void {
    if (this.status.isPaid()) {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    this.status = status;

    if (status.isPaid()) {
      this.paidAt = new Date();
    }

    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
