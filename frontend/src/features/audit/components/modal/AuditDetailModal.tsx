import type { AuditLog, AuditDetailTab } from '../../types/audit';
import { useAuditContext } from '../../context';
import { AuditDiffViewer } from './AuditDiffViewer';
import { AuditMetadataTab } from './AuditMetadataTab';
import { AuditJsonTab } from './AuditJsonTab';
import { AuditModalHeader } from './AuditModalHeader';
import { AuditModalTabsNav } from './AuditModalTabsNav';

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
        <AuditModalHeader log={log} onClose={onClose} />

        <AuditModalTabsNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          hasChanges={Boolean(log.changes)}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'diff' && (
            <AuditDiffViewer log={log} copiedField={copiedField} onCopy={onCopy} />
          )}

          {activeTab === 'info' && (
            <AuditMetadataTab log={log} />
          )}

          {activeTab === 'json' && (
            <AuditJsonTab log={log} copiedField={copiedField} onCopy={onCopy} />
          )}
        </div>

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
