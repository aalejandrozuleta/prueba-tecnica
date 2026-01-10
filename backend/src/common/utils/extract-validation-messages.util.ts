import { ValidationError } from 'class-validator';

/**
 * Extrae mensajes de validación de forma recursiva.
 */
export function extractValidationMessages(
  errors: ValidationError[],
): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children?.length) {
      messages.push(
        ...extractValidationMessages(error.children),
      );
    }
  }

  return messages;
}
