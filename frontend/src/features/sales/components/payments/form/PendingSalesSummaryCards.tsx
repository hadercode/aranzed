export function PendingSalesSummaryCards({
  totalAmountUsd,
  totalAllocatedUsd,
  remainingToAllocateUsd,
  isOverAllocated,
  isFullyAllocated,
}: {
  totalAmountUsd: number;
  totalAllocatedUsd: number;
  remainingToAllocateUsd: number;
  isOverAllocated: boolean;
  isFullyAllocated: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-xs">
      <div>
        <span className="text-[var(--color-text-muted)] block">Monto a Cobrar:</span>
        <span className="text-base font-bold text-[var(--color-text-primary)]">${totalAmountUsd.toFixed(2)}</span>
      </div>
      <div>
        <span className="text-[var(--color-text-muted)] block">Total Asignado:</span>
        <span className={`text-base font-bold ${isOverAllocated ? 'text-rose-600' : 'text-emerald-600'}`}>
          ${totalAllocatedUsd.toFixed(2)}
        </span>
      </div>
      <div>
        <span className="text-[var(--color-text-muted)] block">Saldo por Asignar:</span>
        <span
          className={`text-base font-bold ${
            isOverAllocated ? 'text-rose-600' : isFullyAllocated ? 'text-emerald-600' : 'text-amber-600'
          }`}
        >
          ${remainingToAllocateUsd.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

