import type { ReactNode } from 'react';
import { AuditContext } from './auditContextDefinition';
import { useAuditLogs } from '../hooks/logic/useAuditLogs';

export interface AuditProviderProps {
  children: ReactNode;
}

export function AuditProvider({ children }: AuditProviderProps) {
  const auditState = useAuditLogs();

  return (
    <AuditContext.Provider value={auditState}>
      {children}
    </AuditContext.Provider>
  );
}

export default AuditProvider;
