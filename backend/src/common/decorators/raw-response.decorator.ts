import { SetMetadata } from '@nestjs/common';

/**
 * Evita el wrapping estándar de respuestas.
 */
export const RAW_RESPONSE_KEY = 'raw_response';

export const RawResponse = () => SetMetadata(RAW_RESPONSE_KEY, true);
