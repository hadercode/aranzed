import { Check, Copy } from 'lucide-react';
import type { AuditLog } from '../../types/audit';

interface AuditJsonTabProps {
  log: AuditLog;
  copiedField: string | null;
  onCopy: (text: string, fieldName: string) => void;
}

export function AuditJsonTab({ log, copiedField, onCopy }: AuditJsonTabProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onCopy(JSON.stringify(log, null, 2), 'raw')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copiedField === 'raw' ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copiedField === 'raw' ? 'Copiado al portapapeles' : 'Copiar JSON'}</span>
        </button>
      </div>
      <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] overflow-x-auto text-xs font-mono">
        <pre className="text-gray-950 dark:text-gray-100 font-medium leading-relaxed">
          {JSON.stringify(log, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AuditJsonTab;
