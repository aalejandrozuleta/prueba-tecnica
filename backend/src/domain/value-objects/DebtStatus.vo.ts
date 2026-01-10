export class DebtStatus {
  private constructor(private readonly value: 'PENDING' | 'PAID') {}

  static pending(): DebtStatus {
    return new DebtStatus('PENDING');
  }

  static paid(): DebtStatus {
    return new DebtStatus('PAID');
  }

  isPaid(): boolean {
    return this.value === 'PAID';
  }

  getValue(): string {
    return this.value;
  }
}
