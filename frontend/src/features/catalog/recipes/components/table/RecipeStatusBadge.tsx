import type { RecipeStatus } from '../../types';

export interface RecipeStatusBadgeProps {
  status: RecipeStatus;
}

export function RecipeStatusBadge({ status }: RecipeStatusBadgeProps) {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Activa
        </span>
      );
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Borrador
        </span>
      );
    case 'INACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border border-[var(--color-border)]">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Inactiva
        </span>
      );
  }
}

export default RecipeStatusBadge;
