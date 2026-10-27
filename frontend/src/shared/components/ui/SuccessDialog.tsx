import { useEffect, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./Button";

export interface SuccessDialogProps {
  isOpen: boolean;
  title?: string;
  message?: ReactNode;
  buttonText?: string;
  onClose: () => void;
  autoCloseMs?: number;
}

export function SuccessDialog({
  isOpen,
  title = "¡Operación Exitosa!",
  message = "La acción se ha completado correctamente.",
  buttonText = "Aceptar",
  onClose,
  autoCloseMs,
}: SuccessDialogProps) {
  useEffect(() => {
    if (isOpen && autoCloseMs && autoCloseMs > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface-card)] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[var(--color-border)] text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        {/* Success Icon with Glow Ring */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/20 animate-in zoom-in-50 duration-300">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h3>

        {message && (
          <div className="text-[var(--color-text-secondary)] text-sm mt-2 leading-relaxed">
            {message}
          </div>
        )}

        <div className="mt-6 pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            fullWidth
            className="py-2.5"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessDialog;
