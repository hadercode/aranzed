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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
      {/* Monto a Cobrar */}
      <div className="p-3 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
          Monto a Cobrar
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)]">
            ${totalAmountUsd.toFixed(2)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">USD</span>
        </div>
      </div>

      {/* Total Asignado */}
      <div className="p-3 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
          Total Asignado
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl sm:text-2xl font-black ${
              isOverAllocated ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            ${totalAllocatedUsd.toFixed(2)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">USD</span>
        </div>
      </div>

      {/* Saldo por Asignar */}
      <div className="p-3 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between">
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1">
          Saldo por Asignar
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl sm:text-2xl font-black ${
              isOverAllocated
                ? 'text-rose-600'
                : isFullyAllocated
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            ${remainingToAllocateUsd.toFixed(2)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">USD</span>
        </div>
      </div>
    </div>
  );
}
