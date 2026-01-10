import { v4 as uuid } from 'uuid';

/**
 * Value Object UserId
 */
export class UserId {
  private readonly value: string;

  private constructor(id: string) {
    if (!id) {
      throw new Error('Invalid user id');
    }

    this.value = id;
  }

  /**
   * Crea un nuevo identificador de usuario
   */
  static create(): UserId {
    return new UserId(uuid());
  }

  /**
   * Reconstruye un UserId desde persistencia
   */
  static fromString(id: string): UserId {
    return new UserId(id);
  }

  getValue(): string {
    return this.value;
  }
}
