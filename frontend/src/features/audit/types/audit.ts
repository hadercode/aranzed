export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  action: string;
  model: string;
  entityId: string | null;
  description: string | null;
  previousState: any | null;
  newState: any | null;
  changes: Record<string, { from: any; to: any }> | null;
  ipAddress: string;
  userAgent: string | null;
  method: string;
  endpoint: string;
  statusCode: number;
  status: 'SUCCESS' | 'FAILED';
  errorMessage: string | null;
  durationMs: number;
  metadata: any | null;
  createdAt: string;
}

export interface AuditStats {
  total: number;
  todayCount: number;
  creates: number;
  updates: number;
  deletes: number;
  failed: number;
}

export interface AuditApiResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: AuditStats;
}

export type AuditDetailTab = 'diff' | 'info' | 'json';
