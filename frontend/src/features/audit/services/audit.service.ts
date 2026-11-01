import { ApiClient } from '@/lib/api-client';
import type { AuditApiResponse } from '../types/audit';

export interface AuditQueryParams {
  currentPage: number;
  itemsPerPage: number;
  searchTerm?: string;
  selectedModel?: string;
  selectedAction?: string;
  selectedStatus?: string;
  startDate?: string;
  endDate?: string;
}

export const auditService = {
  async getAuditLogs(params: AuditQueryParams): Promise<AuditApiResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('page', params.currentPage.toString());
    searchParams.append('limit', params.itemsPerPage.toString());

    if (params.searchTerm?.trim()) searchParams.append('search', params.searchTerm.trim());
    if (params.selectedModel) searchParams.append('model', params.selectedModel);
    if (params.selectedAction) searchParams.append('action', params.selectedAction);
    if (params.selectedStatus) searchParams.append('status', params.selectedStatus);
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);

    return ApiClient.get<AuditApiResponse>(`/audit?${searchParams.toString()}`);
  },
};

