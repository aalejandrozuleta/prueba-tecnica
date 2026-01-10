import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '@auth/application/tokens/redis.token';

/**
 * Servicio de caché Redis especializado en operaciones relacionadas con deudas.
 *
 * @remarks
 * Este servicio pertenece a la capa de infraestructura y encapsula
 * el acceso a Redis para operaciones de lectura, escritura e invalidación
 * de datos en caché. Su objetivo es optimizar el rendimiento de consultas
 * frecuentes y reducir la carga sobre la capa de persistencia.
 */
@Injectable()
export class DebtCacheService {
  /**
   * Crea una nueva instancia del servicio `DebtCacheService`.
   *
   * @param redis
   * Cliente Redis inyectado utilizado para operaciones de caché.
   */
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Obtiene un valor almacenado en caché.
   *
   * @typeParam T
   * Tipo esperado del valor almacenado.
   *
   * @param key
   * Clave del valor a recuperar desde Redis.
   *
   * @returns
   * El valor deserializado si existe en caché; de lo contrario, `null`.
   */
  async get<T>(key: string): Promise<T | null> {
    const value: string | null = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  /**
   * Almacena un valor en caché con un tiempo de vida definido.
   *
   * @param key
   * Clave bajo la cual se almacenará el valor en Redis.
   *
   * @param data
   * Datos a serializar y almacenar en caché.
   *
   * @param ttlSeconds
   * Tiempo de vida del valor en segundos.
   * Por defecto, 3600 segundos (1 hora).
   */
  async set(key: string, data: unknown, ttlSeconds = 3600): Promise<void> {
    const serialized = JSON.stringify(data);
    await this.redis.set(key, serialized, 'EX', ttlSeconds);
  }

  /**
   * Invalida entradas de caché que coincidan con un patrón.
   *
   * @remarks
   * Este método se utiliza típicamente después de operaciones
   * de escritura (crear, actualizar, eliminar) para garantizar
   * la consistencia de los datos almacenados en caché.
   *
   * @param pattern
   * Patrón utilizado para buscar claves a invalidar.
   */
  async invalidateByPattern(pattern: string): Promise<void> {
    const keys: string[] = await this.redis.keys(pattern);

    if (keys.length === 0) {
      return;
    }

    await this.redis.del(...keys);
  }
}
