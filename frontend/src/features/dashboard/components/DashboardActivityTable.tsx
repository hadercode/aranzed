import { Activity, RefreshCw } from 'lucide-react';

export interface ActivityLogItem {
  user: string;
  action: string;
  operationType?: 'CREATE' | 'UPDATE';
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
}

interface DashboardActivityTableProps {
  logs: ActivityLogItem[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function DashboardActivityTable({
  logs,
  loading = false,
  onRefresh,
}: DashboardActivityTableProps) {
  return (
    <div className="w-full bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">
              Registro de Operaciones
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Escritura y Edición
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Solo creaciones y actualizaciones registradas en la base de datos
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
            title="Refrescar operaciones"
            type="button"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-transparent border-b border-[var(--color-border)]">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Tipo / Operación</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {loading && logs.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Activity className="w-10 h-10 text-[var(--color-text-muted)] mb-2.5 opacity-40" />
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                      Aún no hay operaciones registradas
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm">
                      Al crear o actualizar ventas, compras, recetas o ajustes de inventario, se reflejarán aquí automáticamente.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[var(--color-surface-hover)] transition-colors group"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gradient-to-tr from-cyan-500/20 to-fuchsia-500/20 text-[var(--color-text-primary)] font-bold text-xs rounded-full flex items-center justify-center shrink-0 border border-cyan-500/30">
                        {item.user.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-sage-500)] transition-colors">
                        {item.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[var(--color-text-secondary)] font-medium max-w-sm">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.operationType === 'CREATE' ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                          + Registro
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                          ↻ Edición
                        </span>
                      )}
                      <span className="truncate">{item.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[var(--color-text-secondary)]">
                    {item.date}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.status === 'Success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : item.status === 'Failed'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status === 'Success'
                        ? 'Completado'
                        : item.status === 'Failed'
                        ? 'Fallido'
                        : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
