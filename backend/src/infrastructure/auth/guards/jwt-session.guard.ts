/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

import { AuthUser } from '../types/auth-user.type';

/**
 * Guard encargado de validar sesiones JWT activas.
 *
 * @remarks
 * Este guard intercepta las solicitudes HTTP protegidas y valida:
 * - La existencia del token JWT en las cookies.
 * - La validez criptográfica del token.
 * - La existencia de la sesión activa en Redis.
 *
 * Forma parte de la capa de infraestructura y se integra con NestJS
 * mediante el sistema de guards. Garantiza que únicamente usuarios con
 * sesiones válidas puedan acceder a recursos protegidos.
 */
@Injectable()
export class JwtSessionGuard implements CanActivate {
  /**
   * Crea una nueva instancia del guard `JwtSessionGuard`.
   *
   * @param jwtService
   * Servicio JWT utilizado para verificar y decodificar el token de acceso.
   *
   * @param redis
   * Cliente Redis utilizado para validar la existencia de la sesión activa.
   */
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Determina si la solicitud actual puede continuar su ejecución.
   *
   * @remarks
   * El flujo de validación incluye:
   * - Extracción del token JWT desde las cookies.
   * - Verificación del token y obtención del payload.
   * - Validación de la sesión en Redis mediante el identificador de sesión.
   * - Inyección del usuario autenticado en el objeto request.
   *
   * @param context
   * Contexto de ejecución que permite acceder a la solicitud HTTP.
   *
   * @returns
   * `true` si la sesión es válida y la solicitud puede continuar.
   *
   * @throws
   * Excepciones de dominio cuando el token es inválido, inexistente
   * o la sesión ha expirado.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    /**
     * Obtiene el token de acceso desde las cookies.
     */
    const token = request.cookies?.access_token;

    if (typeof token !== 'string') {
      throw ExceptionFactory.unauthorized();
    }

    let payload: AuthUser;

    /**
     * Verifica la validez del token JWT.
     */
    try {
      payload = this.jwtService.verify<AuthUser>(token);
    } catch {
      throw ExceptionFactory.unauthorized();
    }

    /**
     * Verifica la existencia de la sesión en Redis.
     */
    const sessionKey = `session:${payload.sessionId}`;
    const exists = await this.redis.exists(sessionKey);

    if (exists !== 1) {
      throw ExceptionFactory.sessionExpired();
    }

    /**
     * Adjunta el usuario autenticado al request.
     */
    request.user = payload;

    return true;
  }
}
