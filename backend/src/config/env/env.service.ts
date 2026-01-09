import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from './env.zod';

/**
 * Servicio tipado para variables de entorno.
 */
@Injectable()
export class EnvService {
  constructor(
    private readonly config: ConfigService<EnvVars>,
  ) {}

  get port(): number {
    return this.config.getOrThrow('PORT');
  }

  get corsOrigin(): string {
    return this.config.getOrThrow('CORS_ORIGIN');
  }

  get nodeEnv(): EnvVars['NODE_ENV'] {
    return this.config.getOrThrow('NODE_ENV');
  }
}
