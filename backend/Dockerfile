# Dockerfile.prod
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# Instalar TODAS las dependencias para build
RUN pnpm install --frozen-lockfile

COPY . .

# Compilar la app
RUN pnpm run build


FROM node:24-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar solo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

# Instalar SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production

EXPOSE 8000

# Usar tsconfig-paths si usas aliases
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]
