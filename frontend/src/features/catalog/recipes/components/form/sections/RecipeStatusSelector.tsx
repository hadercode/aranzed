import { Clock, CheckCircle2, Archive } from 'lucide-react';
import type { RecipeStatus } from '../../../types';

export interface RecipeStatusSelectorProps {
  currentStatus: RecipeStatus;
  onSelectStatus: (status: RecipeStatus) => void;
  error?: string;
}

export function RecipeStatusSelector({
  currentStatus,
  onSelectStatus,
  error,
}: RecipeStatusSelectorProps) {
  const statusOptions: {
    value: RecipeStatus;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      value: 'DRAFT',
      label: 'Borrador',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-950/20',
    },
    {
      value: 'ACTIVE',
      label: 'Activa',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      value: 'INACTIVE',
      label: 'Inactiva',
      icon: Archive,
      color: 'text-slate-600 dark:text-slate-400 border-slate-500/30 bg-slate-50 dark:bg-slate-900/30',
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
        Estado de la Receta *
      </label>
      <div className="grid grid-cols-3 gap-2">
        {statusOptions.map((opt) => {
          const isSelected = currentStatus === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectStatus(opt.value)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? opt.color
                  : 'border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-card)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

