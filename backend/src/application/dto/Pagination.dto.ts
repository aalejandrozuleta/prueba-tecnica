/**
 * Representa el resultado de una operación paginada genérica.
 *
 * @typeParam T
 * Tipo de los elementos contenidos en el resultado.
 *
 * @remarks
 * Esta interfaz se utiliza para estandarizar las respuestas paginadas
 * en consultas de listados (por ejemplo: usuarios, deudas, transacciones).
 * Permite a las capas superiores (controllers, gateways, clientes frontend)
 * manejar la paginación de forma consistente.
 */
export interface PaginatedResult<T> {
  /**
   * Conjunto de elementos correspondientes a la página actual.
   *
   * @remarks
   * El contenido de este arreglo depende del tipo genérico `T`.
   */
  data: T[];

  /**
   * Cantidad total de registros disponibles.
   *
   * @remarks
   * Representa el total de elementos sin aplicar paginación,
   * útil para calcular el número total de páginas.
   */
  total: number;

  /**
   * Número de la página actual.
   *
   * @remarks
   * Generalmente comienza desde 1, dependiendo de la implementación.
   */
  page: number;

  /**
   * Cantidad máxima de elementos por página.
   *
   * @remarks
   * Determina el tamaño del conjunto `data` devuelto.
   */
  limit: number;
}
