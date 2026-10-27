import { create } from 'zustand';

export type FeedbackType = 'forbidden' | 'error' | 'warning' | 'success' | 'info';

export interface FeedbackState {
  isOpen: boolean;
  type: FeedbackType;
  title: string | null;
  message: string | null;
  details: string | null;
  statusCode: number | null;

  // Actions
  showFeedback: (params: {
    type?: FeedbackType;
    title?: string;
    message: string;
    details?: string;
    statusCode?: number;
    autoCloseMs?: number;
  }) => void;
  showError: (
    error: unknown,
    options?: { title?: string; statusCode?: number; details?: string }
  ) => void;
  showForbidden: (
    message?: string,
    options?: { title?: string; details?: string }
  ) => void;
  showSuccess: (
    message: string,
    options?: { title?: string; autoCloseMs?: number }
  ) => void;
  clearFeedback: () => void;
}

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  isOpen: false,
  type: 'error',
  title: null,
  message: null,
  details: null,
  statusCode: null,

  showFeedback: ({
    type = 'error',
    title,
    message,
    details,
    statusCode,
    autoCloseMs,
  }) => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }

    set({
      isOpen: true,
      type,
      title: title || null,
      message,
      details: details || null,
      statusCode: statusCode || null,
    });

    if (autoCloseMs && autoCloseMs > 0) {
      autoCloseTimer = setTimeout(() => {
        get().clearFeedback();
      }, autoCloseMs);
    }
  },

  showError: (error, options = {}) => {
    let message = 'Ha ocurrido un error inesperado al procesar la solicitud.';
    let statusCode = options.statusCode;

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object') {
      const errObj = error as Record<string, unknown>;
      if (typeof errObj.message === 'string') {
        message = errObj.message;
      }
      if (typeof errObj.statusCode === 'number' || typeof errObj.status === 'number') {
        statusCode = Number(errObj.statusCode || errObj.status);
      }
    }

    // Detección automática de errores Forbidden (403)
    const lower = message.toLowerCase();
    const isForbidden =
      statusCode === 403 ||
      lower.includes('forbidden') ||
      lower.includes('403') ||
      lower.includes('no tienes permiso') ||
      lower.includes('acceso denegado') ||
      lower.includes('prohibido');

    get().showFeedback({
      type: isForbidden ? 'forbidden' : 'error',
      title:
        options.title ||
        (isForbidden ? 'Acceso Restringido (403)' : 'Error en la operación'),
      message,
      details: options.details,
      statusCode: isForbidden ? 403 : statusCode,
    });
  },

  showForbidden: (message, options = {}) => {
    get().showFeedback({
      type: 'forbidden',
      title: options.title || 'Acceso Restringido (403)',
      message:
        message ||
        'No dispones de los permisos necesarios para realizar esta acción o visualizar este recurso.',
      details: options.details,
      statusCode: 403,
    });
  },

  showSuccess: (message, options = {}) => {
    get().showFeedback({
      type: 'success',
      title: options.title || 'Operación exitosa',
      message,
      autoCloseMs: options.autoCloseMs ?? 5000,
      statusCode: 200,
    });
  },

  clearFeedback: () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    set({
      isOpen: false,
      title: null,
      message: null,
      details: null,
      statusCode: null,
    });
  },
}));

export default useFeedbackStore;
