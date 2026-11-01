import { Shield, X } from 'lucide-react';
import type { AuditLog } from '../../types/audit';

interface AuditModalHeaderProps {
  log: AuditLog;
  onClose: () => void;
}

export function AuditModalHeader({ log, onClose }: AuditModalHeaderProps) {
  return (
    <div className="px-6 py-4.5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-bg)]">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[var(--color-sage-100)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/20 dark:text-[var(--color-sage-300)]">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">
              {log.description || `${log.action} en ${log.model}`}
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                log.status === 'SUCCESS'
                  ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {log.status} ({log.statusCode})
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            ID Registro: <span className="font-mono">{log.id}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

