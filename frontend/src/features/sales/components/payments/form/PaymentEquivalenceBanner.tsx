import { ArrowRightLeft } from 'lucide-react';

export function PaymentEquivalenceBanner({
  totalAmountUsd,
  totalAmountVes,
}: {
  totalAmountUsd: number;
  totalAmountVes: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-xl bg-sage-500/5 border border-sage-500/10 gap-3">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-sage-600" />
        <span className="text-xs text-[var(--color-text-secondary)]">Equivalencia de Cobro:</span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-[var(--color-text-muted)] mr-1">USD:</span>
          <strong className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
            ${totalAmountUsd.toFixed(2)}
          </strong>
        </div>
        <div className="h-4 w-px bg-[var(--color-border)]" />
        <div>
          <span className="text-[var(--color-text-muted)] mr-1">VES:</span>
          <strong className="text-sm text-blue-600 dark:text-blue-400 font-bold">
            Bs. {totalAmountVes.toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}

