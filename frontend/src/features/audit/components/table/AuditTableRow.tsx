import { Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { AuditLog } from '../../types/audit';
import { AuditActionBadge } from './AuditActionBadge';
import { AuditMethodBadge } from './AuditMethodBadge';

interface AuditTableRowProps {
  log: AuditLog;
  onSelectLog: (log: AuditLog) => void;
}

export function AuditTableRow({ log, onSelectLog }: AuditTableRowProps) {
  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  const { date, time } = formatTimestamp(log.createdAt);
  const hasModifications = Boolean(log.previousState && log.newState);
  const isSuccess = log.status === 'SUCCESS';

  return (
    <tr
      className="hover:bg-[var(--color-surface-hover)] transition-colors group cursor-pointer"
      onClick={() => onSelectLog(log)}
    >
      {/* Fecha y Hora */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="font-medium text-[var(--color-text-primary)] text-xs">
          {date}
        </div>
        <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </td>

      {/* Usuario */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[var(--color-sage-100)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/20 dark:text-[var(--color-sage-300)] flex items-center justify-center font-bold text-xs shrink-0">
            {log.userEmail ? log.userEmail.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0">
            <div
              className="font-medium text-xs truncate max-w-[170px]"
              title={log.userEmail || 'Sistema'}
            >
              {log.userEmail || 'Sistema / Público'}
            </div>
            {log.userName && (
              <div className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[170px]">
                {log.userName}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Acción */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <AuditActionBadge action={log.action} hasModifications={hasModifications} />
      </td>

      {/* Modelo / Objeto */}
      <td className="py-3.5 px-4">
        <div className="font-medium text-xs flex items-center gap-1.5">
          <span className="text-[var(--color-text-primary)]">{log.model}</span>
        </div>
        <div
          className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 max-w-[200px] mt-0.5"
          title={log.description || ''}
        >
          {log.description || log.endpoint}
        </div>
      </td>

      {/* Petición HTTP */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <AuditMethodBadge method={log.method} />
          <span
            className="font-mono text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[140px]"
            title={log.endpoint}
          >
            {log.endpoint}
          </span>
        </div>
        <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
          {log.durationMs}ms
        </div>
      </td>

      {/* IP / Estado */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs">
          {isSuccess ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{log.statusCode} OK</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-semibold text-[11px]">
              <XCircle className="w-3.5 h-3.5" />
              <span>{log.statusCode} Error</span>
            </span>
          )}
        </div>
        <div className="text-[11px] text-gray-400 font-mono mt-0.5">{log.ipAddress}</div>
      </td>

      {/* Botón Ver Detalle */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectLog(log);
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface-hover)] hover:bg-[var(--color-sage-50)] hover:text-[var(--color-sage-600)] dark:hover:bg-[var(--color-sage-500)]/20 dark:hover:text-[var(--color-sage-300)] text-[var(--color-text-secondary)] transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Consultar</span>
        </button>
      </td>
    </tr>
  );
}

export default AuditTableRow;
