import { ValidationError } from 'class-validator';

/**
 * Extrae mensajes de validación de forma recursiva.
 *
 * @remarks
 * Esta función recorre una estructura de errores generada por `class-validator`
 * y obtiene todos los mensajes de validación disponibles, incluyendo aquellos
 * anidados en validaciones de objetos complejos.
 *
 * Es especialmente útil para centralizar y normalizar los mensajes de error
 * antes de ser procesados por capas superiores, como filtros de excepciones
 * o sistemas de internacionalización.
 *
 * @param errors
 * Arreglo de errores de validación producidos por `class-validator`.
 *
 * @returns
 * Un arreglo plano de mensajes de validación extraídos.
 */
export function extractValidationMessages(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    /**
     * Extrae los mensajes definidos en las restricciones del error actual.
     */
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    /**
     * Procesa recursivamente los errores hijos, si existen.
     */
    if (error.children && error.children.length > 0) {
      messages.push(...extractValidationMessages(error.children));
    }
  }

  return messages;
}
