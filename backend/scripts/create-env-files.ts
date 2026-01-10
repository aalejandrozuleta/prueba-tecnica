import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Crea los archivos de variables de entorno del proyecto.
 *
 * @remarks
 * Este script genera:
 * - `.env`
 * - `.env.development`
 *
 * Sobrescribe los archivos si ya existen.
 * No carga ni valida variables de entorno.
 */
function createEnvFiles(): void {
  const rootPath = process.cwd();

  const envPath = join(rootPath, '.env');
  const envDevPath = join(rootPath, '.env.development');

  /**
   * Contenido del archivo `.env`
   */
  const envContent = `# Environment variables declared in this file are NOT automatically loaded by Prisma.
# Please add \`import "dotenv/config";\` to your \`prisma.config.ts\` file, or use the Prisma CLI with Bun
# to load environment variables from .env files: https://pris.ly/prisma-config-env-vars.
#
# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
#
# The following \`prisma+postgres\` URL is similar to the URL produced by running a local Prisma Postgres
# server with the \`prisma dev\` CLI command, when not choosing any non-default ports or settings. The API key, unlike the
# one found in a remote Prisma Postgres URL, does not contain any sensitive information.

DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"
`;

  /**
   * Contenido del archivo `.env.development`
   */
  const envDevelopmentContent = `# ======================
# APP
# ======================
NODE_ENV=development
PORT=8000

# ======================
# CORS
# ======================
CORS_ORIGIN=http://localhost:3000

# ======================
# DATABASES
# ======================
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pruebaTecnica
DATABASE_NAME=pruebaTecnica

REDIS_URL=redis://redis:6379
MONGO_URI=mongodb://mongo:27017/project

PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=pruebaTecnica
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pruebaTecnica

# ======================
# JWT
# ======================
ACCESS_EXPIRES_IN=15m
REFRESH_EXPIRES_DAYS=7

JWT_ACCESS_SECRET=8fZQy2J7mP4dA6KcNwE5SxR9uVYtB3HhLQG0C1iOaMZr
JWT_REFRESH_SECRET=VxR3Kp0Z6YQ9A1wJ2t7mF4dE8C5sLHGNUBaOMiWc

# ======================
# REDIS
# ======================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
`;

  writeFileSync(envPath, envContent, { encoding: 'utf-8' });
  writeFileSync(envDevPath, envDevelopmentContent, { encoding: 'utf-8' });

  console.info('✅ Archivos .env y .env.development creados correctamente');
}

/**
 * Punto de entrada del script.
 */
createEnvFiles();
