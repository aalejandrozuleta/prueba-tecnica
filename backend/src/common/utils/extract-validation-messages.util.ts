import { ValidationError } from 'class-validator';

/**
 * Extrae mensajes de validación de forma recursiva.
 */
export function extractValidationMessages(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      messages.push(...extractValidationMessages(error.children));
    }
  }

  return messages;
}
