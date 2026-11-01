import { useQuery } from '@tanstack/react-query';
import { auditService, type AuditQueryParams } from '../../services';
import type { AuditApiResponse } from '../../types/audit';

export type { AuditQueryParams };

export const AUDIT_QUERY_KEY = ['audit', 'logs'] as const;

export function useAuditLogsQuery(params?: AuditQueryParams) {
  const queryParams: AuditQueryParams = params ?? {
    currentPage: 1,
    itemsPerPage: 20,
  };

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<AuditApiResponse, Error>({
    queryKey: [...AUDIT_QUERY_KEY, queryParams],
    queryFn: () => auditService.getAuditLogs(queryParams),
    staleTime: 1000 * 30,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar los registros de auditoría'
    : null;

  return {
    logs: data?.items || [],
    stats: data?.stats || {
      total: 0,
      todayCount: 0,
      creates: 0,
      updates: 0,
      deletes: 0,
      failed: 0,
    },
    totalPages: data?.totalPages || 1,
    totalItems: data?.total || 0,
    loading: isLoading,
    isFetching,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
