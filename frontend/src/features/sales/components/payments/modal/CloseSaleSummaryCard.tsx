import type { Sale } from '../../../types';

export function CloseSaleSummaryCard({
  sale,
  pendingUsd,
}: {
  sale: Sale;
  pendingUsd: number;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-[var(--color-text-muted)]">Venta:</span>
        <span className="font-mono font-bold text-[var(--color-text-primary)]">{sale.saleNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--color-text-muted)]">Cliente:</span>
        <span className="font-medium text-[var(--color-text-primary)]">{sale.customerName}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--color-text-muted)]">Total Factura:</span>
        <span className="font-semibold text-[var(--color-text-primary)]">${sale.total.toFixed(2)} USD</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[var(--color-text-muted)]">Monto Cobrado:</span>
        <span className="font-semibold text-emerald-600">${(sale.paidAmount || 0).toFixed(2)} USD</span>
      </div>
      <div className="flex justify-between pt-1 border-t border-[var(--color-border)]">
        <span className="font-semibold text-[var(--color-text-primary)]">Diferencia / Saldo Restante:</span>
        <span className="font-bold text-amber-600 dark:text-amber-400">${pendingUsd.toFixed(2)} USD</span>
      </div>
    </div>
  );
}

