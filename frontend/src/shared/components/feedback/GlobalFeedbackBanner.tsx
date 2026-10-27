import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  X,
} from "lucide-react";
import { useFeedbackStore } from "@/shared/hooks/store";
import { ForbiddenIllustration } from "./ForbiddenIllustration";

export function GlobalFeedbackBanner() {
  const { isOpen, type, title, message, details, clearFeedback } =
    useFeedbackStore();

  if (!isOpen || (!message && !title)) return null;

  // 1. Caso Especial: 403 Forbidden / Acceso Restringido (con ilustración personalizada)
  if (type === "forbidden") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/30 p-5 shadow-sm backdrop-blur-xs transition-all animate-in fade-in slide-in-from-top-3 duration-300"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Ilustración de Seguridad 403 */}
          <div className="shrink-0 flex items-center justify-center">
            <ForbiddenIllustration className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-sm" />
          </div>

          {/* Información del Error de Permisos */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20 mb-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>403 • Acceso Restringido</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
              {title || "Permisos insuficientes para esta operación"}
            </h3>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {message}
            </p>

            {details && (
              <p className="mt-2 text-xs font-mono bg-rose-500/10 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg text-rose-800 dark:text-rose-200 border border-rose-500/20 inline-block">
                Detalle técnico: {details}
              </p>
            )}

            <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-xs text-[var(--color-text-muted)]">
                Si consideras que deberías tener acceso, consulta con un
                administrador de tu empresa.
              </span>
            </div>
          </div>

          {/* Botón de Cerrar */}
          <button
            type="button"
            onClick={clearFeedback}
            className="self-start sm:self-center p-1.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-rose-500/15 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            aria-label="Cerrar notificación de error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Errores Generales (500, Validación, Red)
  if (type === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="mb-6 flex items-start justify-between gap-3 p-4.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/25 border border-rose-500/25 text-rose-800 dark:text-rose-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {title}
              </h4>
            )}
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {message}
            </p>
            {details && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-mono">
                {details}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={clearFeedback}
          className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-rose-500/10 transition-colors"
          aria-label="Cerrar error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 3. Advertencias
  if (type === "warning") {
    return (
      <div
        role="alert"
        className="mb-6 flex items-start justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex items-start gap-3 min-w-0">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {title && <h4 className="text-sm font-semibold">{title}</h4>}
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearFeedback}
          className="p-1 rounded-lg hover:bg-amber-500/15 transition-colors"
          aria-label="Cerrar advertencia"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 4. Éxito
  if (type === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mb-6 flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            {title && (
              <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                {title}
              </h4>
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearFeedback}
          className="p-1 rounded-lg hover:bg-emerald-500/15 transition-colors"
          aria-label="Cerrar confirmación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // 5. Informativo
  return (
    <div
      role="status"
      className="mb-6 flex items-center justify-between gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-blue-800 dark:text-blue-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={clearFeedback}
        className="p-1 rounded-lg hover:bg-blue-500/15 transition-colors"
        aria-label="Cerrar mensaje informativo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default GlobalFeedbackBanner;
