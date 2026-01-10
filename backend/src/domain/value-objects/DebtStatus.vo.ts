export class DebtStatus {
  private constructor(private readonly value: 'PENDING' | 'PAID') {}

  static pending(): DebtStatus {
    return new DebtStatus('PENDING');
  }

  static paid(): DebtStatus {
    return new DebtStatus('PAID');
  }

  static from(value: 'PENDING' | 'PAID'): DebtStatus {
    switch (value) {
      case 'PENDING':
        return DebtStatus.pending();
      case 'PAID':
        return DebtStatus.paid();
      default:
        throw new Error('Invalid debt status');
    }
  }

  isPaid(): boolean {
    return this.value === 'PAID';
  }

  getValue(): 'PENDING' | 'PAID' {
    return this.value;
  }
}
