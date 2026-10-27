import { Layers, ArrowRight, Check, Copy } from 'lucide-react';
import type { AuditLog } from '../../types/audit';
import { useAuditContext } from '../../context';

export interface AuditDiffViewerProps {
  log?: AuditLog;
  copiedField?: string | null;
  onCopy?: (text: string, fieldName: string) => void;
}

export function AuditDiffViewer({
  log: propLog,
  copiedField: propCopiedField,
  onCopy: propOnCopy,
}: AuditDiffViewerProps) {
  const context = useAuditContext();

  const log = propLog ?? context.selectedLog;
  const copiedField = propCopiedField !== undefined ? propCopiedField : context.copiedField;
  const onCopy = propOnCopy ?? context.copyToClipboard;

  if (!log) return null;

  return (
    <div className="space-y-6">
      {/* Changes Summary if any */}
      {log.changes ? (
        <div className="alert-info p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-950 dark:text-blue-300 mb-2.5">
            <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Resumen de Campos Modificados:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(log.changes).map(([field, delta]: [string, any]) => (
              <div
                key={field}
                className="p-2.5 rounded-lg bg-[var(--color-surface-card)] border border-blue-200/80 dark:border-blue-900/40 shadow-xs"
              >
                <span className="font-bold text-gray-950 dark:text-gray-100 font-mono block">
                  {field}
                </span>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="text-rose-950 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded font-mono font-semibold line-through truncate max-w-[140px]">
                    {delta.from !== null && delta.from !== undefined
                      ? JSON.stringify(delta.from)
                      : 'null'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-emerald-950 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono font-bold truncate max-w-[140px]">
                    {delta.to !== null && delta.to !== undefined
                      ? JSON.stringify(delta.to)
                      : 'null'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Side-by-Side: Estado Anterior vs Como Quedó */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estado Anterior */}
        <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-rose-100 dark:bg-rose-950/40 border-b border-rose-300 dark:border-rose-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span className="text-xs font-bold text-rose-950 dark:text-rose-200">
                Estado Anterior (Antes)
              </span>
            </div>
            {log.previousState && (
              <button
                type="button"
                onClick={() =>
                  onCopy(JSON.stringify(log.previousState, null, 2), 'prev')
                }
                className="text-[11px] font-semibold text-rose-950 dark:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'prev' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'prev' ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>

          <div className="p-4 flex-1 overflow-x-auto text-xs font-mono">
            {log.previousState ? (
              <pre className="text-rose-950 dark:text-rose-100 whitespace-pre-wrap leading-relaxed font-mono font-medium">
                {JSON.stringify(log.previousState, null, 2)}
              </pre>
            ) : (
              <div className="py-12 text-center text-gray-500 italic">
                {log.action === 'CREATE' || log.action === 'REGISTER'
                  ? 'No aplica estado anterior (Registro nuevo)'
                  : 'Sin snapshot previo registrado'}
              </div>
            )}
          </div>
        </div>

        {/* Como Quedó / Estado Nuevo */}
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-emerald-100 dark:bg-emerald-950/40 border-b border-emerald-300 dark:border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Estado Posterior (Como Quedó)
              </span>
            </div>
            {log.newState && (
              <button
                type="button"
                onClick={() =>
                  onCopy(JSON.stringify(log.newState, null, 2), 'next')
                }
                className="text-[11px] font-semibold text-emerald-950 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'next' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'next' ? 'Copiado' : 'Copiar'}</span>
              </button>
            )}
          </div>

          <div className="p-4 flex-1 overflow-x-auto text-xs font-mono">
            {log.newState ? (
              <pre className="text-emerald-950 dark:text-emerald-100 whitespace-pre-wrap leading-relaxed font-mono font-medium">
                {JSON.stringify(log.newState, null, 2)}
              </pre>
            ) : (
              <div className="py-12 text-center text-gray-500 italic">
                {log.action === 'DELETE'
                  ? 'Objeto eliminado permanentemente (null)'
                  : 'Sin datos posteriores disponibles'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditDiffViewer;
