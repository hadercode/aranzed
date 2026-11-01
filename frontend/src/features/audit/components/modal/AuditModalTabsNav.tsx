import { Layers, Activity, FileText } from 'lucide-react';
import type { AuditDetailTab } from '../../types/audit';

interface AuditModalTabsNavProps {
  activeTab: AuditDetailTab;
  onTabChange: (tab: AuditDetailTab) => void;
  hasChanges?: boolean;
}

export function AuditModalTabsNav({
  activeTab,
  onTabChange,
  hasChanges,
}: AuditModalTabsNavProps) {
  return (
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
        {hasChanges && (
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
  );
}

