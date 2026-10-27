import { Calculator } from "lucide-react";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

interface TransactionSummarySectionProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionSummarySection({
  formContext,
}: TransactionSummarySectionProps) {
  const { metrics } = formContext;

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-border)] mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                Resumen Operativo
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Totales proyectados de la transacción
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm py-1 border-b border-[var(--color-border)]/50">
              <span className="text-[var(--color-text-secondary)]">
                Productos Seleccionados:
              </span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {metrics.totalItems} ítems
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-[var(--color-border)]/50">
              <span className="text-[var(--color-text-secondary)]">
                Cantidad Total de Unidades:
              </span>
              <span className="font-semibold text-[var(--color-text-primary)] font-mono">
                {metrics.totalQuantity.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
