import { Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export interface SalePaymentStickyBarProps {
  totalAmountUsd: number;
  totalAllocatedUsd: number;
  remainingToAllocateUsd: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SalePaymentStickyBar({
  totalAmountUsd,
  totalAllocatedUsd,
  remainingToAllocateUsd,
  isSubmitting,
  onCancel,
  onSubmit,
}: SalePaymentStickyBarProps) {
  const isOverAllocated = remainingToAllocateUsd < -0.01;
  const canSubmit = totalAmountUsd > 0 && totalAllocatedUsd > 0 && !isOverAllocated;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 backdrop-blur-md bg-[var(--color-surface-card)]/90 border-t border-[var(--color-border)] py-3 px-4 sm:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Pills de Estado de Asignación */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Cobro:</span>
            <strong className="text-[var(--color-text-primary)]">
              ${totalAmountUsd.toFixed(2)}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Asignado:</span>
            <strong
              className={
                isOverAllocated ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'
              }
            >
              ${totalAllocatedUsd.toFixed(2)}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <span className="text-[var(--color-text-muted)]">Resta:</span>
            <strong
              className={
                isOverAllocated
                  ? 'text-rose-600 font-bold'
                  : Math.abs(remainingToAllocateUsd) <= 0.01 && totalAmountUsd > 0
                  ? 'text-emerald-600 font-bold'
                  : 'text-amber-600 font-bold'
              }
            >
              ${remainingToAllocateUsd.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            leftIcon={<X className="w-4 h-4" />}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={!canSubmit || isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Registrar Cobro
          </Button>
        </div>
      </div>
    </div>
  );
}
