Prueba Técnica – Backend API

Backend desarrollado con NestJS, orientado a una arquitectura limpia y escalable, con énfasis en seguridad, mantenibilidad, observabilidad y buenas prácticas profesionales.

El proyecto implementa gestión de usuarios, autenticación segura, manejo de deudas, cacheo con Redis, persistencia con PostgreSQL y soporte para internacionalización.

==================================================
ELECCIÓN DE HERRAMIENTAS
==================================================

NestJS
- Arquitectura modular y escalable
- Integración nativa con TypeScript
- Excelente soporte para validaciones, seguridad y testing

TypeScript
- Tipado estricto
- Mayor mantenibilidad
- Menos errores en tiempo de ejecución
- Código documentado con TSDoc

Prisma ORM (v7)
- ORM moderno con tipado fuerte
- Migraciones versionadas
- Modelos claros y mantenibles
- Uso de Prisma Client v7 con adapter PG (requerido para Docker y CI)

PostgreSQL
- Base de datos relacional robusta
- Soporte completo para transacciones
- Ideal para relaciones complejas

Redis
- Cache de datos (deudas)
- Manejo de sesiones activas
- Control de intentos de login
- Mejora de performance y seguridad

==================================================
ESTRUCTURA DEL PROYECTO
==================================================

src/
- application/        Casos de uso, DTOs y puertos
- domain/             Entidades, Value Objects y reglas de negocio
- infrastructure/     Prisma, Redis, JWT, controllers
- modules/            Módulos NestJS
- common/             Utilidades compartidas
- config/             Configuración (env, swagger, auth)
- main.ts             Bootstrap de la aplicación

Arquitectura basada en separación de responsabilidades
y principios de arquitectura hexagonal.

==================================================
INTERNACIONALIZACIÓN (i18n)
==================================================

Soporte para múltiples idiomas mediante nestjs-i18n.

Estructura:
assets/i18n/
- en/
  - common.json
  - user.json
  - debt.json
- es/
  - common.json
  - user.json
  - debt.json

==================================================
SEGURIDAD
==================================================

- Autenticación JWT (access + refresh)
- Cookies httpOnly
- Sesiones activas en Redis
- Control de intentos de login
- Helmet (headers de seguridad)
- Rate limiting
- Validaciones estrictas de DTOs
- Sanitización de respuestas

==================================================
INSTALACIÓN LOCAL
==================================================

Requisitos:
- Node.js >= 20
- pnpm
- Docker y Docker Compose

Instalar dependencias:
pnpm install

Crear variables de entorno:
pnpm ts-node scripts/create-env-files.ts

==================================================
EJECUCIÓN CON DOCKER
==================================================

Levantar servicios:
docker compose -f docker-compose.dev.yml up -d

Ejecutar migraciones:
pnpm prisma migrate deploy

Seed de datos:
pnpm ts-node prisma/seed.ts

Limpiar todas las tablas:
pnpm ts-node prisma/seed-clean.ts

==================================================
ACCESO
==================================================

API:
http://localhost:8000

Swagger (solo desarrollo):
http://localhost:8000/docs

==================================================
TESTING
==================================================

- Tests unitarios
- Tests de infraestructura con mocks
- Tests de integración controlados
- pnpm run test || pnpm run test:cov

Framework: Jest

==================================================
OBSERVABILIDAD
==================================================

Preparado para:
- Logging estructurado
- Grafana y Loki
- Health checks y métricas

==================================================
Documentación
==================================================
pnpm run docs

==================================================
CONCLUSIÓN
==================================================

Puede también importar el insomnia project para la prueba de la API