import { useContext } from 'react';
import { AuditContext } from './auditContextDefinition';
import type { AuditContextType } from './auditContextDefinition';

export function useAuditContext(): AuditContextType {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAuditContext debe ser utilizado dentro de un AuditProvider');
  }
  return context;
}
