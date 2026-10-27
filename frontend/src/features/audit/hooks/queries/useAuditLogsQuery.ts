import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { AuditLog, AuditStats, AuditApiResponse } from '../../types/audit';

interface UseAuditLogsQueryParams {
  currentPage: number;
  itemsPerPage: number;
  searchTerm?: string;
  selectedModel?: string;
  selectedAction?: string;
  selectedStatus?: string;
  startDate?: string;
  endDate?: string;
}

export function useAuditLogsQuery() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    todayCount: 0,
    creates: 0,
    updates: 0,
    deletes: 0,
    failed: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (params: UseAuditLogsQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      searchParams.append('page', params.currentPage.toString());
      searchParams.append('limit', params.itemsPerPage.toString());

      if (params.searchTerm?.trim()) searchParams.append('search', params.searchTerm.trim());
      if (params.selectedModel) searchParams.append('model', params.selectedModel);
      if (params.selectedAction) searchParams.append('action', params.selectedAction);
      if (params.selectedStatus) searchParams.append('status', params.selectedStatus);
      if (params.startDate) searchParams.append('startDate', params.startDate);
      if (params.endDate) searchParams.append('endDate', params.endDate);

      const response = await ApiClient.get<AuditApiResponse>(`/audit?${searchParams.toString()}`);
      setLogs(response.items || []);
      setTotalItems(response.total || 0);
      setTotalPages(response.totalPages || 1);

      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err: any) {
      setError(err?.toString() || 'Error al cargar los registros de auditoría');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logs,
    stats,
    totalPages,
    totalItems,
    loading,
    error,
    fetchLogs,
  };
}
