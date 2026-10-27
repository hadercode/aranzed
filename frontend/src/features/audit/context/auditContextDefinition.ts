import { createContext } from 'react';
import type { UseAuditLogsReturn } from '../hooks/logic/useAuditLogs';

export type AuditContextType = UseAuditLogsReturn;

export const AuditContext = createContext<AuditContextType | undefined>(undefined);
