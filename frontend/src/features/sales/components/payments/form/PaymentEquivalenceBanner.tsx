import { ArrowRightLeft } from 'lucide-react';

export function PaymentEquivalenceBanner({
  totalAmountUsd,
  totalAmountVes,
}: {
  totalAmountUsd: number;
  totalAmountVes: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-transparent border border-[var(--color-border)] gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ArrowRightLeft className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
            Equivalencia de Cobro
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            Cálculo simultáneo en divisas y moneda nacional
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">USD:</span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
            ${totalAmountUsd.toFixed(2)}
          </span>
        </div>

        <div className="h-6 w-px bg-[var(--color-border)]" />

        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">VES:</span>
          <span className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400">
            Bs. {totalAmountVes.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
