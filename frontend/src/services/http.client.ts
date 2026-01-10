import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';

/**
 * Respuesta estándar de éxito proveniente del backend.
 */
export interface SuccessResponse<T> {
  message: string;
  data?: T;
}

/**
 * Respuesta estándar de error proveniente del backend.
 */
export interface ErrorResponse {
  message: string;
  code: string;
  details?: unknown;
}

/**
 * Cliente HTTP centralizado.
 *
 * - Soporta cookies httpOnly
 * - Respeta contratos SuccessResponse / ErrorResponse
 * - NO maneja UX ni i18n
 */
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });


    this.initializeInterceptors();
  }

  /**
   * Inicializa interceptores globales.
   */
  private initializeInterceptors() {
    console.log('base url', process.env.NEXT_PUBLIC_API_URL);
    
    /**
     * Interceptor de response:
     * - Normaliza errores
     */
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data) {
          return Promise.reject(error.response.data);
        }

        return Promise.reject({
          message: 'errors.unknown',
          code: 'UNKNOWN_ERROR',
        } satisfies ErrorResponse);
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Methods                                   */
  /* -------------------------------------------------------------------------- */

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client
      .get<SuccessResponse<T>>(url, config)
      .then((res) => res.data);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client
      .post<SuccessResponse<T>>(url, data, config)
      .then((res) => res.data);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.client
      .put<SuccessResponse<T>>(url, data, config)
      .then((res) => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client
      .delete<SuccessResponse<T>>(url, config)
      .then((res) => res.data);
  }
}

/**
 * Instancia única del cliente HTTP.
 */
export const httpClient = new HttpClient();
