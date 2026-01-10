import { DocumentBuilder } from '@nestjs/swagger';

/**
 * Configuración base de Swagger / OpenAPI.
 */
export const swaggerConfig = new DocumentBuilder()
  .setTitle('prueba técnica api')
  .setDescription('Documentación oficial de la API')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
  .build();
