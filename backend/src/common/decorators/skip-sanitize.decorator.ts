import { SetMetadata } from '@nestjs/common';

/**
 * Evita la sanitización de datos en la respuesta.
 */
export const SKIP_SANITIZE_KEY = 'skip_sanitize';

export const SkipSanitize = () =>
  SetMetadata(SKIP_SANITIZE_KEY, true);
