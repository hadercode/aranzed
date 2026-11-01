import { CheckCircle2, AlertTriangle, XCircle, Package } from 'lucide-react';
import type { StockImportRowStatus } from '../../types';

export const statusBadgeStyles: Record<
  StockImportRowStatus,
  { bg: string; label: string; icon: any }
> = {
  VALID: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    label: 'Listo para Ingresar',
    icon: CheckCircle2,
  },
  DUPLICATE: {
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    label: 'Duplicado',
    icon: AlertTriangle,
  },
  INVALID: {
    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
    label: 'Con Errores',
    icon: XCircle,
  },
  SKIPPED: {
    bg: 'bg-slate-500/10 border-slate-500/20 text-slate-500 dark:text-slate-400',
    label: 'Omitido (Cant. 0)',
    icon: Package,
  },
};

export function StockImportStatusBadge({ status }: { status: StockImportRowStatus }) {
  const cfg = statusBadgeStyles[status] || statusBadgeStyles.INVALID;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{cfg.label}</span>
    </span>
  );
}

