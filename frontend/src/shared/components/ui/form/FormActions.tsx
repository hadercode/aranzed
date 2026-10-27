import type { ReactNode } from "react";
import { Button } from "../Button";

export interface FormActionsProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  loadingText?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  showCancel?: boolean;
  children?: ReactNode;
  className?: string;
}

export function FormActions({
  onCancel,
  cancelText = "Cancelar",
  submitText = "Guardar",
  loading = false,
  loadingText = "Guardando...",
  submitDisabled = false,
  cancelDisabled = false,
  showCancel = true,
  children,
  className = "pt-4 flex gap-3",
}: FormActionsProps) {
  return (
    <div className={className}>
      {showCancel && onCancel && (
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={cancelDisabled || loading}
          className="flex-1"
        >
          {cancelText}
        </Button>
      )}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        loadingText={loadingText}
        disabled={submitDisabled}
        className="flex-1"
      >
        {submitText}
      </Button>

      {children}
    </div>
  );
}

export default FormActions;
