// src/config/env/env.zod.ts
import { z } from 'zod';

/**
 * Esquema de variables de entorno.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),

  REDIS_URL: z.string(),
  DATABASE_URL: z.string(),
  MONGO_URI: z.string(),

  CORS_ORIGIN: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string().optional(),
  ACCESS_EXPIRES_IN: z.string().default('15m'),
  REFRESH_EXPIRES_DAYS: z.coerce.number().default(7),

  TURNSTILE_SECRET_KEY: z.string(),
});

export type EnvVars = z.infer<typeof envSchema>;
