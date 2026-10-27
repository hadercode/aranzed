import { DollarSign, CreditCard, CheckCircle2, Ban } from 'lucide-react';
import type { SalePaymentsStats } from '../../../hooks/queries';

export interface SalePaymentsStatsCardsProps {
  stats: SalePaymentsStats;
}

export function SalePaymentsStatsCards({ stats }: SalePaymentsStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total USD */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Total Cobrado (USD)
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
          ${stats.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {stats.confirmedCount} cobros confirmados
        </p>
      </div>

      {/* Total VES */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Total Cobrado (VES)
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
          Bs. {stats.totalVes.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Moneda local recaudada
        </p>
      </div>

      {/* Confirmados */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Cobros Aplicados
          </span>
          <div className="p-2 rounded-xl bg-sage-500/10 text-sage-600 dark:text-sage-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
          {stats.confirmedCount}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          {stats.todayCount} registrados hoy
        </p>
      </div>

      {/* Anulados */}
      <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Cobros Anulados
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Ban className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
          {stats.cancelledCount}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Con saldos revertidos
        </p>
      </div>
    </div>
  );
}
