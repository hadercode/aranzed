import type { Sale } from "../../../types";

interface SalePreviewSummaryProps {
  sale: Sale;
}

export function SalePreviewSummary({ sale }: SalePreviewSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-1">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          Notas u Observaciones
        </span>
        <p className="text-xs text-[var(--color-text-primary)] italic">
          {sale.notes || "Sin notas adicionales registradas en este documento."}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--color-surface-card)] to-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2">
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Subtotal Base:</span>
          <span className="font-medium">${sale.subtotal.toFixed(2)}</span>
        </div>
        {sale.discountAmount > 0 && (
          <div className="flex justify-between text-xs text-rose-600">
            <span>Descuentos:</span>
            <span className="font-semibold">-${sale.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>IVA Estimado:</span>
          <span className="font-medium">${sale.taxAmount.toFixed(2)}</span>
        </div>
        <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-baseline">
          <span className="font-bold text-sm text-[var(--color-text-primary)]">
            TOTAL USD:
          </span>
          <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
            ${sale.total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-1">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            TOTAL VES:
          </span>
          <span className="font-bold text-sm text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
            Bs. {sale.totalLocal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

