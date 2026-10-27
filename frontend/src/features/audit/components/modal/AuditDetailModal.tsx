import {
  Shield,
  X,
  Layers,
  Activity,
  FileText,
} from 'lucide-react';
import type { AuditLog, AuditDetailTab } from '../../types/audit';
import { useAuditContext } from '../../context';
import { AuditDiffViewer } from './AuditDiffViewer';
import { AuditMetadataTab } from './AuditMetadataTab';
import { AuditJsonTab } from './AuditJsonTab';

export interface AuditDetailModalProps {
  isOpen?: boolean;
  log?: AuditLog | null;
  activeTab?: AuditDetailTab;
  onTabChange?: (tab: AuditDetailTab) => void;
  onClose?: () => void;
  copiedField?: string | null;
  onCopy?: (text: string, fieldName: string) => void;
}

export function AuditDetailModal({
  isOpen: propIsOpen,
  log: propLog,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  onClose: propOnClose,
  copiedField: propCopiedField,
  onCopy: propOnCopy,
}: AuditDetailModalProps) {
  const context = useAuditContext();

  const isOpen = propIsOpen ?? context.isDetailOpen;
  const log = propLog !== undefined ? propLog : context.selectedLog;
  const activeTab = propActiveTab ?? context.activeDetailTab;
  const onTabChange = propOnTabChange ?? context.setActiveDetailTab;
  const onClose = propOnClose ?? context.closeLogDetail;
  const copiedField = propCopiedField !== undefined ? propCopiedField : context.copiedField;
  const onCopy = propOnCopy ?? context.copyToClipboard;

  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
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

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-[var(--color-border)] px-6 bg-[var(--color-surface-card)] gap-2">
          <button
            type="button"
            onClick={() => onTabChange('diff')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'diff'
                ? 'border-[var(--color-sage-500)] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Estado Anterior vs. Como Quedó</span>
            {log.changes && (
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('info')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'border-[var(--color-sage-500)] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Metadatos & Contexto HTTP</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('json')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'json'
                ? 'border-[var(--color-sage-500)] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>JSON Completo</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: DIFF VISUAL */}
          {activeTab === 'diff' && (
            <AuditDiffViewer log={log} copiedField={copiedField} onCopy={onCopy} />
          )}

          {/* TAB 2: METADATOS Y CONTEXTO HTTP */}
          {activeTab === 'info' && (
            <AuditMetadataTab log={log} />
          )}

          {/* TAB 3: JSON COMPLETO */}
          {activeTab === 'json' && (
            <AuditJsonTab log={log} copiedField={copiedField} onCopy={onCopy} />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface-bg)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] transition-all shadow-xs cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditDetailModal;
