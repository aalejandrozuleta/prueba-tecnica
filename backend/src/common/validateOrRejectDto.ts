import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

/**
 * Transforma un objeto plano a una instancia de clase DTO y lo valida usando `class-validator`.
 *
 * Si se encuentran errores de validación, lanza una excepción `BadRequestException`
 * incluyendo un detalle estructurado de los errores.
 *
 * @typeParam T - Tipo del DTO
 * @param dtoClass - Clase constructora del DTO
 * @param plainObject - Objeto plano que representa los datos recibidos
 * @returns Una instancia validada del DTO
 * @throws BadRequestException Si la validación falla, lanza una excepción con los errores detallados
 */
export async function validateOrRejectDto<T>(
  dtoClass: new () => T,
  plainObject: unknown,
): Promise<T> {
  const instance = plainToInstance(dtoClass, plainObject);

  const errors = await validate(instance as object, {
    whitelist: true, // Elimina propiedades no decoradas
    forbidNonWhitelisted: true, // Lanza error si existen propiedades no decoradas
    forbidUnknownValues: true, // Lanza error si se pasa algo que no es un objeto
    validationError: { target: false }, // No incluir la instancia original en los errores
  });

  if (errors.length > 0) {
    const formattedErrors: Record<string, string[]> = {};

    /**
     * Recorre los errores recursivamente y los convierte en un objeto plano.
     *
     * @param errs - Lista de errores de validación
     * @param parentPath - Ruta del campo padre para errores anidados
     */
    const flattenErrors = (errs: ValidationError[], parentPath = ''): void => {
      for (const error of errs) {
        const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

        if (error.constraints) {
          formattedErrors[propertyPath] = Object.values(error.constraints);
        }

        if (error.children && error.children.length > 0) {
          flattenErrors(error.children, propertyPath);
        }
      }
    };

    flattenErrors(errors);

    throw new BadRequestException({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  return instance;
}
