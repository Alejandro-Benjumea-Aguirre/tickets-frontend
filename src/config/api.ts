// src/config/api.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

// ─── Tipos globales ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  error: boolean;
  status: number;
  body: T;
  message?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedBody<T> {
  data: T[];
  meta: PaginationMeta;
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

// ─── Instancia Axios ───────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL_API ?? 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helper: limpia params undefined/null ─────────────────────────────────────

const sanitizeParams = (params?: QueryParams) =>
  params
    ? Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    : undefined;

// ─── Clase API ────────────────────────────────────────────────────────────────

class Api {
  // GET /url?params
  async get<T = unknown>(
    url: string,
    params?: QueryParams,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.get<ApiResponse<T>>(url, {
      params: sanitizeParams(params),
      ...config,
    });
  }

  // POST /url  { body }
  async post<T = unknown>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.post<ApiResponse<T>>(url, body, config);
  }

  // PATCH /url  { body }
  async patch<T = unknown>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.patch<ApiResponse<T>>(url, body, config);
  }

  // PUT /url  { body }
  async put<T = unknown>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.put<ApiResponse<T>>(url, body, config);
  }

  // DELETE /url
  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.delete<ApiResponse<T>>(url, config);
  }

  // POST multipart/form-data (subida de archivos)
  async upload<T = unknown>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    });
  }
}

export const api = new Api();