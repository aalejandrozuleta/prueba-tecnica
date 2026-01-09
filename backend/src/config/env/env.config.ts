// src/config/env/env.config.ts
import { envSchema } from './env.zod';

/**
 * Valida las variables de entorno para ConfigModule.
 */
export const validateEnv = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map(
        (issue) =>
          `- ${issue.path.join('.')}: ${issue.message}`,
      )
      .join('\n');

    throw new Error(`❌ Invalid environment variables:\n${message}`);
  }

  return parsed.data;
};
