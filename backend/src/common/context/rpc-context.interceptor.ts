import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RequestContextService } from './request-context.service';

/**
 * Interfaz que define el payload que puede venir en una solicitud RPC.
 */
interface RpcPayload {
  lang?: string;
  [key: string]: unknown;
}

/**
 * Interceptor que captura el idioma (`lang`) del payload de una solicitud RPC
 * y lo establece en el contexto de la solicitud usando `RequestContextService`.
 *
 * Esto permite que cualquier servicio o capa acceda al idioma actual durante el ciclo de vida de la solicitud.
 */
@Injectable()
export class RpcContextInterceptor implements NestInterceptor {
  /**
   * Método que intercepta la solicitud RPC, extrae el idioma del payload,
   * y ejecuta el flujo de la solicitud dentro del contexto asincrónico.
   *
   * @param context - El contexto de ejecución de NestJS.
   * @param next - El manejador de la llamada que continúa con la ejecución.
   * @returns Un observable que contiene la respuesta de la llamada RPC.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const rawPayload: unknown = context.switchToRpc().getData();

    const payload: RpcPayload =
      typeof rawPayload === 'object' && rawPayload !== null ? (rawPayload as RpcPayload) : {};

    const lang = typeof payload.lang === 'string' ? payload.lang : 'es';

    return new Observable((subscriber) => {
      RequestContextService.run({ lang }, () => {
        next.handle().subscribe({
          next: (value) => subscriber.next(value),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
