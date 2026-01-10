/**
 * Value Object Email
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }

    this.value = email.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }
}
