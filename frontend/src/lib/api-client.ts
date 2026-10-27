import { useFeedbackStore } from '../shared/hooks/store';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Normaliza y construye URLs completas para recursos estáticos (logos, avatares, comprobantes).
 */
export function getAssetUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

interface FetchOptions extends RequestInit {
  data?: any;
}

export class ApiClient {
  public static getToken(): string | null {
    const storage = localStorage.getItem('auth-storage');
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        return parsed?.state?.token || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  static async request<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { data, headers: customHeaders, ...customConfig } = options;
    const token = this.getToken();

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(customHeaders as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: data ? 'POST' : 'GET',
      ...customConfig,
      headers,
    };

    if (data) {
      config.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const responseData = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorMessage = responseData?.message || 'Algo salió mal con la petición';

        if (response.status === 403) {
          useFeedbackStore.getState().showForbidden(errorMessage);
        } else if (response.status === 401) {
          // Token expirado o inválido: limpiar sesión y redirigir
          localStorage.removeItem('auth-storage');
          if (
            typeof window !== 'undefined' &&
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/register'
          ) {
            window.location.href = '/login';
          }
        }

        throw new Error(errorMessage);
      }

      return responseData as T;
    } catch (error: any) {
      return Promise.reject(error.message);
    }
  }

  static get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  static post<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  static put<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  static patch<T>(endpoint: string, data: any, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  static delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
