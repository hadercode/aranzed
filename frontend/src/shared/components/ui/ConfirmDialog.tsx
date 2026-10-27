import type { ReactNode } from "react";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "./Button";

export type ConfirmVariant = "danger" | "warning" | "info";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (variant) {
      case "danger":
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "warning":
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "danger";
      case "warning":
        return "primary";
      case "info":
      default:
        return "primary";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="bg-[var(--color-surface-card)] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[var(--color-border)] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          {renderIcon()}
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
              {title}
            </h3>
            <div className="text-[var(--color-text-secondary)] text-sm mt-1.5 leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3 border-t border-[var(--color-border)] mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
