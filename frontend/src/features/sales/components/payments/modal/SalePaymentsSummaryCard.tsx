interface SalePaymentsSummaryCardProps {
  total: number;
  paidAmount?: number;
  totalLocal: number;
  paidAmountLocal?: number;
}

export function SalePaymentsSummaryCard({
  total,
  paidAmount = 0,
  totalLocal,
  paidAmountLocal = 0,
}: SalePaymentsSummaryCardProps) {
  const pendingUsd = Math.max(0, Number((total - paidAmount).toFixed(2)));
  const pendingVes = Math.max(0, Number((totalLocal - paidAmountLocal).toFixed(2)));

  return (
    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
      <div>
        <span className="text-[var(--color-text-muted)] block">Total Facturado:</span>
        <span className="text-sm font-bold text-[var(--color-text-primary)]">
          ${total.toFixed(2)}
        </span>
      </div>
      <div>
        <span className="text-[var(--color-text-muted)] block">Monto Recaudado:</span>
        <span className="text-sm font-bold text-emerald-600">
          ${paidAmount.toFixed(2)}
        </span>
      </div>
      <div>
        <span className="text-[var(--color-text-muted)] block">Saldo Pendiente:</span>
        <span
          className={`text-sm font-bold ${
            pendingUsd > 0.01 ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          ${pendingUsd.toFixed(2)}{" "}
          <span className="text-xs font-normal text-[var(--color-text-muted)]">
            (Bs. {pendingVes.toFixed(2)})
          </span>
        </span>
      </div>
    </div>
  );
}

