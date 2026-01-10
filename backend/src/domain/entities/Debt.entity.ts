import { Money } from '../value-objects/Money.vo';
import { DebtStatus } from '../value-objects/DebtStatus.vo';

export class Debt {
  private status: DebtStatus;
  private paidAt?: Date;

  constructor(
    private readonly id: string,
    private readonly debtorId: string,
    private readonly creditorId: string,
    private readonly amount: Money,
    private readonly createdAt: Date,
  ) {
    this.status = DebtStatus.pending();
  }

  pay(): void {
    if (this.status.isPaid()) {
      throw new Error('Debt already paid');
    }

    this.status = DebtStatus.paid();
    this.paidAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getAmount(): number {
    return this.amount.getValue();
  }

  isPaid(): boolean {
    return this.status.isPaid();
  }
}
