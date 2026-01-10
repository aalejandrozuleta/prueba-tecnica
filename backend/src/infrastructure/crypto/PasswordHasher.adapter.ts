import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { PasswordHasher } from '@auth/application/ports/PasswordHasher.port';

/**
 * Implementación del puerto `PasswordHasher` utilizando Argon2.
 *
 * @remarks
 * Esta clase pertenece a la capa de infraestructura y proporciona una
 * implementación concreta para el hashing y verificación de contraseñas
 * usando el algoritmo Argon2id, recomendado por OWASP para almacenamiento
 * seguro de credenciales.
 *
 * La configuración utilizada prioriza seguridad sobre rendimiento,
 * equilibrando consumo de memoria y tiempo de cómputo.
 */
@Injectable()
export class ArgonPasswordHasher implements PasswordHasher {
  /**
   * Genera un hash seguro a partir de una contraseña en texto plano.
   *
   * @remarks
   * Utiliza el algoritmo Argon2id con parámetros configurados para
   * mitigar ataques de fuerza bruta y hardware especializado.
   *
   * @param plain
   * Contraseña en texto plano proporcionada por el usuario.
   *
   * @returns
   * Hash seguro de la contraseña.
   *
   * @throws
   * Excepción interna del servidor si ocurre un error durante el proceso
   * de hashing.
   */
  async hash(plain: string): Promise<string> {
    try {
      return await argon2.hash(plain, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
      });
    } catch {
      throw new InternalServerErrorException('PASSWORD_HASH_FAILED');
    }
  }

  /**
   * Compara una contraseña en texto plano con un hash almacenado.
   *
   * @remarks
   * Este método se utiliza durante el proceso de autenticación para
   * validar credenciales sin exponer la contraseña original.
   *
   * @param plain
   * Contraseña en texto plano a verificar.
   *
   * @param hash
   * Hash previamente almacenado de la contraseña.
   *
   * @returns
   * `true` si la contraseña coincide con el hash; de lo contrario, `false`.
   *
   * @throws
   * Excepción interna del servidor si ocurre un error durante la verificación.
   */
  async compare(plain: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      throw new InternalServerErrorException('PASSWORD_VERIFY_FAILED');
    }
  }
}
