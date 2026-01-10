/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from '../types/auth-user.type';

/**
 * Decorador de parámetro para obtener el usuario autenticado desde la request.
 *
 * @remarks
 * Este decorador extrae el objeto `user` previamente adjuntado al request
 * por el mecanismo de autenticación (por ejemplo, guards o middleware).
 * Permite acceder al usuario autenticado de forma tipada dentro de los
 * controladores, manteniendo el código limpio y desacoplado.
 *
 * Su uso es típico en handlers de controladores HTTP que requieren
 * información del usuario autenticado sin acceder directamente al objeto
 * `Request`.
 *
 * @example
 * ```ts
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthUser) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  /**
   * Función factory del decorador.
   *
   * @param _data
   * Dato opcional pasado al decorador (no utilizado en esta implementación).
   *
   * @param ctx
   * Contexto de ejecución que permite acceder al request HTTP.
   *
   * @returns
   * El usuario autenticado tipado como `AuthUser`.
   */
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
