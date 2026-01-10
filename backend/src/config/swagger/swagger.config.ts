import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Configuración base de Swagger / OpenAPI.
 */
export const swaggerConfig = new DocumentBuilder()
  .setTitle('Prueba técnica API')
  .setDescription('Documentación oficial de la API')
  .setVersion('1.0.0')
  .addCookieAuth('access_token', {
    type: 'apiKey',
    in: 'cookie',
  })
  .build();
