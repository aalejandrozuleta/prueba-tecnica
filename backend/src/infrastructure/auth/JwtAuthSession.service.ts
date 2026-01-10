/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

import { AuthSessionService } from '@auth/application/ports/AuthSessionService.port';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';
import { ExceptionFactory } from '@auth/domain/exceptions/ExceptionFactory';

/**
 * Implementación del manejo de sesiones utilizando JWT y Redis.
 *
 * @remarks
 * Esta clase pertenece a la capa de infraestructura y provee una
 * implementación concreta del puerto `AuthSessionService`.
 *
 * La estrategia utilizada combina:
 * - JWT para autenticación stateless (access y refresh tokens).
 * - Redis para mantener sesiones activas, permitir revocación
 *   y controlar expiración de sesiones.
 *
 * Permite:
 * - Reutilizar una sesión activa por usuario.
 * - Revocar sesiones explícitamente.
 * - Renovar tokens de acceso mediante refresh tokens.
 */
@Injectable()
export class AuthSessionServiceImpl implements AuthSessionService {
  /**
   * Crea una nueva instancia de `AuthSessionServiceImpl`.
   *
   * @param jwtService
   * Servicio JWT utilizado para firmar y verificar tokens.
   *
   * @param redis
   * Cliente Redis utilizado para almacenar y validar sesiones activas.
   */
  constructor(
    private readonly jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Crea o reutiliza una sesión de autenticación para un usuario.
   *
   * @remarks
   * El flujo de creación de sesión es el siguiente:
   * 1. Se verifica si el usuario ya posee una sesión activa.
   * 2. Si no existe, se genera un nuevo `sessionId`.
   * 3. Se persiste la sesión en Redis con un TTL definido.
   * 4. Se generan los tokens de acceso y actualización.
   *
   * @param userId
   * Identificador único del usuario autenticado.
   *
   * @param email
   * Correo electrónico del usuario.
   *
   * @param name
   * Nombre del usuario, si está disponible.
   *
   * @returns
   * Un objeto que contiene el token de acceso y el token de actualización.
   */
  async createSession(
    userId: string,
    email: string,
    name?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userSessionKey = `user_session:${userId}`;

    /**
     * 1️⃣ Verifica si ya existe una sesión activa para el usuario.
     */
    let sessionId = await this.redis.get(userSessionKey);

    /**
     * 2️⃣ Si no existe sesión, se crea una nueva.
     */
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      await this.redis.set(userSessionKey, sessionId, 'EX', 60 * 60 * 24);
    }

    const sessionKey = `session:${sessionId}`;

    /**
     * Payload base de la sesión.
     */
    const payload = {
      id: userId,
      email,
      name,
      sessionId,
    };

    /**
     * 3️⃣ Guarda o renueva la sesión en Redis.
     */
    await this.redis.set(sessionKey, JSON.stringify(payload), 'EX', 60 * 60 * 24);

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ sessionId }, { expiresIn: '7d' }),
    };
  }

  /**
   * Renueva un token de acceso utilizando un refresh token válido.
   *
   * @remarks
   * El flujo incluye:
   * - Verificación criptográfica del refresh token.
   * - Validación de la sesión activa en Redis.
   * - Emisión de un nuevo token de acceso.
   *
   * @param refreshToken
   * Token de actualización emitido previamente.
   *
   * @returns
   * Un nuevo token de acceso JWT.
   *
   * @throws
   * Excepciones de dominio cuando el refresh token es inválido
   * o la sesión ha expirado.
   */
  async refresh(refreshToken: string): Promise<string> {
    let payload: { sessionId: string };

    try {
      payload = this.jwtService.verify<{ sessionId: string }>(refreshToken);
    } catch {
      throw ExceptionFactory.invalidRefreshToken();
    }

    const sessionRaw = await this.redis.get(`session:${payload.sessionId}`);

    if (!sessionRaw) {
      throw ExceptionFactory.sessionExpired();
    }

    const session = JSON.parse(sessionRaw) as {
      id: string;
      email: string;
      name?: string;
      sessionId: string;
    };

    return this.jwtService.sign(
      {
        id: session.id,
        email: session.email,
        name: session.name,
        sessionId: session.sessionId,
      },
      { expiresIn: '15m' },
    );
  }

  /**
   * Revoca una sesión activa.
   *
   * @remarks
   * Este método elimina:
   * - La sesión asociada al `sessionId`.
   * - La referencia de sesión activa del usuario.
   *
   * Se utiliza para logout explícito o invalidación forzada
   * de sesiones.
   *
   * @param sessionId
   * Identificador único de la sesión a revocar.
   */
  async revokeSession(sessionId: string): Promise<void> {
    const sessionRaw = await this.redis.get(`session:${sessionId}`);

    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as { id: string };
      await this.redis.del(`user_session:${session.id}`);
    }

    await this.redis.del(`session:${sessionId}`);
  }
}
