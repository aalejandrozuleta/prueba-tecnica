/**
 * Value Object HashedPassword
 */
export class HashedPassword {
  private readonly value: string;

  private constructor(hash: string) {
    if (!hash) {
      throw new Error('Invalid password hash');
    }

    this.value = hash;
  }

  /**
   * Crea un HashedPassword recién generado
   */
  static create(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }

  /**
   * Reconstruye el hash desde persistencia
   */
  static fromHash(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }

  getValue(): string {
    return this.value;
  }


  static restore(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }
}
