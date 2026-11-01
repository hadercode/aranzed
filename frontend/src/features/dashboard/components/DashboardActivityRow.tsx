import type { ActivityLogItem } from './DashboardActivityTable';

interface DashboardActivityRowProps {
  log: ActivityLogItem;
}

export function DashboardActivityRow({ log }: DashboardActivityRowProps) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-medium text-[var(--color-text-primary)] block">
          {log.user}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {log.operationType && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                log.operationType === 'CREATE'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {log.operationType === 'CREATE' ? 'Creación' : 'Edición'}
            </span>
          )}
          <span className="text-[var(--color-text-secondary)] truncate max-w-xs md:max-w-md">
            {log.action}
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
        {log.date}
      </td>

      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            log.status === 'Success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : log.status === 'Pending'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {log.status === 'Success' ? 'Éxito' : log.status === 'Pending' ? 'Pendiente' : 'Fallido'}
        </span>
      </td>
    </tr>
  );
}

