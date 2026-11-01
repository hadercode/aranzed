import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { ImportRowStatus } from '../../../types';

export const statusBadgeStyles: Record<
  ImportRowStatus,
  { bg: string; text: string; label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  VALID: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    label: 'Listo para Importar',
    icon: CheckCircle2,
  },
  DUPLICATE: {
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Duplicado',
    icon: AlertTriangle,
  },
  INVALID: {
    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
    text: 'text-rose-700 dark:text-rose-300',
    label: 'Con Errores',
    icon: XCircle,
  },
};

export function ProductImportStatusBadge({ status }: { status: ImportRowStatus }) {
  const meta = statusBadgeStyles[status];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {meta.label}
    </span>
  );
}

