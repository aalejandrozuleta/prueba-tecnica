import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';
import { languageStore } from '@/stores/language.store';

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
 * - Adjunta Accept-Language automáticamente
 * - NO maneja UX ni textos
 */
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL ??
        'http://localhost:8000',
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
    /* ---------------------------- Request interceptor ---------------------------- */
    this.client.interceptors.request.use(
      (config) => {
        config.headers = config.headers ?? {};

        config.headers['Accept-Language'] =
          languageStore.get();

        return config;
      },
      (error) => Promise.reject(error),
    );

    /* ---------------------------- Response interceptor ---------------------------- */
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

  get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.client
      .get<T>(url, config)
      .then((res) => res.data);
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.client
      .post<T>(url, data, config)
      .then((res) => res.data);
  }

  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<SuccessResponse<T>> {
    return this.client
      .put<SuccessResponse<T>>(url, data, config)
      .then((res) => res.data);
  }

  delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<SuccessResponse<T>> {
    return this.client
      .delete<SuccessResponse<T>>(url, config)
      .then((res) => res.data);
  }
}

/**
 * Instancia única del cliente HTTP.
 */
export const httpClient = new HttpClient();
