import { useState } from 'react';
import type { AuditLog, AuditDetailTab } from '../../types/audit';

export function useAuditDetailModal() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<AuditDetailTab>('diff');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openLogDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const closeLogDetail = () => {
    setIsDetailOpen(false);
  };

  return {
    selectedLog,
    isDetailOpen,
    activeDetailTab,
    setActiveDetailTab,
    copiedField,
    copyToClipboard,
    openLogDetail,
    closeLogDetail,
  };
}

