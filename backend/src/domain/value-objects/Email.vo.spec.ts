import { Email } from './Email.vo';
import { DomainException } from '../exceptions/DomainException';

describe('Email Value Object', () => {
  describe('creación válida', () => {
    it('debe crear un email válido', () => {
      const email = new Email('user@test.com');

      expect(email.getValue()).toBe('user@test.com');
    });

    it('debe normalizar el email (trim y lowercase)', () => {
      const email = new Email('  USER@TEST.COM  ');

      expect(email.getValue()).toBe('user@test.com');
    });
  });

  describe('creación inválida', () => {
    it('debe lanzar DomainException con un email inválido', () => {
      expect(() => new Email('invalid-email')).toThrow(DomainException);
    });

    it('debe lanzar DomainException con string vacío', () => {
      expect(() => new Email('')).toThrow(DomainException);
    });

    it('debe lanzar DomainException con email incompleto', () => {
      expect(() => new Email('user@test')).toThrow(DomainException);
    });
  });
});
