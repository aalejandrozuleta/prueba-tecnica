import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { LoginAttemptRepository } from '@auth/application/ports/LoginAttemptRepository.port';
import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

/**
 * Adaptador Redis para el manejo de intentos de inicio de sesión.
 *
 * @remarks
 * Esta clase pertenece a la capa de infraestructura e implementa el
 * puerto `LoginAttemptRepository` utilizando Redis como mecanismo
 * de almacenamiento temporal.
 *
 * Permite:
 * - Contabilizar intentos fallidos de login.
 * - Bloquear temporalmente combinaciones de email + IP.
 * - Reiniciar contadores tras autenticación exitosa.
 *
 * Está diseñada para mitigar ataques de fuerza bruta de forma eficiente.
 */
@Injectable()
export class LoginAttemptRedisAdapter implements LoginAttemptRepository {
  /**
   * Tiempo de vida (TTL) para los intentos fallidos, en segundos.
   *
   * @remarks
   * Por defecto, 15 minutos.
   */
  private static readonly FAIL_TTL_SECONDS = 15 * 60; // 15 min

  /**
   * Crea una nueva instancia del adaptador `LoginAttemptRedisAdapter`.
   *
   * @param redis
   * Cliente Redis utilizado para almacenar y consultar los intentos
   * de inicio de sesión.
   */
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Construye la clave Redis para intentos fallidos.
   *
   * @param email
   * Correo electrónico utilizado en el intento de login.
   *
   * @param ip
   * Dirección IP desde la cual se realiza el intento.
   *
   * @returns
   * Clave Redis para el contador de fallos.
   */
  private failKey(email: string, ip: string): string {
    return `login:fail:${email}:${ip}`;
  }

  /**
   * Construye la clave Redis para bloqueos activos.
   *
   * @param email
   * Correo electrónico bloqueado.
   *
   * @param ip
   * Dirección IP bloqueada.
   *
   * @returns
   * Clave Redis que representa el bloqueo activo.
   */
  private blockKey(email: string, ip: string): string {
    return `login:block:${email}:${ip}`;
  }

  /**
   * Indica si una combinación de email e IP se encuentra bloqueada.
   *
   * @param email
   * Correo electrónico consultado.
   *
   * @param ip
   * Dirección IP consultada.
   *
   * @returns
   * `true` si el acceso está bloqueado; de lo contrario, `false`.
   */
  async isBlocked(email: string, ip: string): Promise<boolean> {
    return (await this.redis.exists(this.blockKey(email, ip))) === 1;
  }

  /**
   * Incrementa el contador de intentos fallidos de inicio de sesión.
   *
   * @remarks
   * Si es el primer intento registrado, se establece un TTL para
   * permitir la expiración automática del contador.
   *
   * @param email
   * Correo electrónico utilizado en el intento.
   *
   * @param ip
   * Dirección IP desde la cual se realiza el intento.
   *
   * @returns
   * Número total de intentos fallidos acumulados.
   */
  async increment(email: string, ip: string): Promise<number> {
    const key = this.failKey(email, ip);

    const attempts = await this.redis.incr(key);

    /**
     * Si es el primer intento, se establece el TTL.
     */
    if (attempts === 1) {
      await this.redis.expire(key, LoginAttemptRedisAdapter.FAIL_TTL_SECONDS);
    }

    return attempts;
  }

  /**
   * Reinicia el contador de intentos fallidos.
   *
   * @remarks
   * Normalmente se ejecuta tras un inicio de sesión exitoso.
   *
   * @param email
   * Correo electrónico asociado a los intentos.
   *
   * @param ip
   * Dirección IP asociada a los intentos.
   */
  async reset(email: string, ip: string): Promise<void> {
    await this.redis.del(this.failKey(email, ip));
  }

  /**
   * Bloquea temporalmente los intentos de inicio de sesión.
   *
   * @param email
   * Correo electrónico a bloquear.
   *
   * @param ip
   * Dirección IP desde la cual se originaron los intentos.
   *
   * @param ttlSeconds
   * Tiempo de bloqueo expresado en segundos.
   */
  async block(email: string, ip: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.blockKey(email, ip), '1', 'EX', ttlSeconds);
  }
}
