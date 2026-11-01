import { Activity, RefreshCw } from 'lucide-react';
import { DashboardActivityRow } from './DashboardActivityRow';

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
          <tbody>
            {loading && logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[var(--color-text-secondary)]">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-sage-500)]" />
                    <span>Cargando operaciones recientes...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[var(--color-text-secondary)]">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Activity className="w-8 h-8 text-[var(--color-text-muted)] opacity-40 mb-1" />
                    <p className="font-medium text-sm">No hay actividades de escritura recientes</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Las acciones de creación y actualización aparecerán aquí automáticamente.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log, index) => <DashboardActivityRow key={index} log={log} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardActivityTable;
