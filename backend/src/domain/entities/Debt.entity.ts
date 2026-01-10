import { ExceptionFactory } from '../exceptions/ExceptionFactory';
import { DebtStatus } from '../value-objects/DebtStatus.vo';
import { Money } from '../value-objects/Money.vo';

/**
 * Entidad de dominio que representa una deuda.
 *
 * @remarks
 * Esta entidad encapsula las reglas de negocio asociadas a una deuda,
 * incluyendo su ciclo de vida, estados permitidos y validaciones
 * críticas. Forma parte del núcleo de dominio y no depende de
 * infraestructura ni frameworks.
 */
export class Debt {
  /**
   * Identificador único de la deuda.
   */
  private readonly id: string;

  /**
   * Fecha de creación de la deuda.
   */
  private readonly createdAt: Date;

  /**
   * Estado actual de la deuda.
   */
  private status: DebtStatus;

  /**
   * Fecha en la que la deuda fue pagada, si aplica.
   */
  private paidAt?: Date;

  /**
   * Descripción opcional de la deuda.
   */
  private description?: string;

  /**
   * Identificador del usuario deudor.
   */
  private readonly debtorId: string;

  /**
   * Identificador del usuario acreedor.
   */
  private readonly creditorId: string;

  /**
   * Monto de la deuda representado como Value Object.
   */
  private amount: Money;

  /**
   * Fecha de la última actualización de la deuda.
   */
  private updatedAt?: Date;

  /**
   * Constructor interno de la entidad.
   *
   * @remarks
   * No contiene validaciones de reglas de negocio. Su uso está
   * restringido a los métodos factory de la entidad.
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
   * Factory para crear una nueva deuda.
   *
   * @remarks
   * Aplica reglas de negocio de creación, como impedir que
   * el deudor y el acreedor sean la misma persona.
   *
   * @param props
   * Propiedades necesarias para crear la deuda.
   *
   * @returns
   * Una nueva instancia de la entidad `Debt`.
   *
   * @throws
   * Excepción de dominio si el deudor y el acreedor son iguales.
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
   * Factory para rehidratar una deuda desde persistencia.
   *
   * @remarks
   * Este método no ejecuta validaciones de reglas de negocio,
   * ya que se asume que los datos provienen de una fuente confiable
   * (base de datos).
   *
   * @param props
   * Propiedades persistidas de la deuda.
   *
   * @returns
   * Instancia rehidratada de la entidad `Debt`.
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
   * Marca la deuda como pagada.
   *
   * @throws
   * Excepción de dominio si la deuda ya se encuentra pagada.
   */
  pay(): void {
    if (this.status.isPaid()) {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    this.status = DebtStatus.paid();
    this.paidAt = new Date();
  }

  /* ===== Getters ===== */

  /**
   * Obtiene el identificador de la deuda.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Obtiene el monto de la deuda como valor numérico.
   */
  getAmount(): number {
    return this.amount.getValue();
  }

  /**
   * Obtiene el estado actual de la deuda.
   */
  getStatus(): 'PENDING' | 'PAID' {
    return this.status.getValue();
  }

  /**
   * Indica si la deuda se encuentra pagada.
   */
  isPaid(): boolean {
    return this.status.isPaid();
  }

  /**
   * Obtiene la fecha de pago de la deuda, si existe.
   */
  getPaidAt(): Date | undefined {
    return this.paidAt;
  }

  /**
   * Obtiene la descripción de la deuda.
   */
  getDescription(): string | undefined {
    return this.description;
  }

  /**
   * Obtiene el identificador del deudor.
   */
  getDebtorId(): string {
    return this.debtorId;
  }

  /**
   * Obtiene el identificador del acreedor.
   */
  getCreditorId(): string {
    return this.creditorId;
  }

  /**
   * Obtiene la fecha de creación de la deuda.
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Obtiene la fecha de la última actualización de la deuda.
   */
  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  /**
   * Actualiza el monto de la deuda.
   *
   * @remarks
   * No se permite modificar el monto si la deuda ya está pagada.
   *
   * @param amount
   * Nuevo monto representado como Value Object.
   *
   * @throws
   * Excepción de dominio si la deuda ya fue pagada.
   */
  updateAmount(amount: Money): void {
    if (this.status.isPaid()) {
      throw ExceptionFactory.debtAlreadyPaid();
    }

    this.amount = amount;
    this.touch();
  }

  /**
   * Actualiza la descripción de la deuda.
   *
   * @param description
   * Nueva descripción de la deuda.
   */
  updateDescription(description?: string): void {
    this.description = description;
    this.touch();
  }

  /**
   * Actualiza el estado de la deuda.
   *
   * @remarks
   * Si el nuevo estado es pagado, se registra automáticamente
   * la fecha de pago.
   *
   * @param status
   * Nuevo estado de la deuda como Value Object.
   *
   * @throws
   * Excepción de dominio si la deuda ya se encuentra pagada.
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

  /**
   * Actualiza la marca de tiempo de modificación.
   *
   * @remarks
   * Método interno utilizado para reflejar cambios en la entidad.
   */
  private touch(): void {
    this.updatedAt = new Date();
  }
}