import { ApiClient } from '@/lib/api-client';
import type {
  InventoryTransaction,
  CreateInventoryTransactionDto,
  UpdateInventoryTransactionDto,
  TransactionFilters,
  PaginatedTransactionsResponse,
} from '../types';

export const transactionsService = {
  async getAll(filters: TransactionFilters = {}): Promise<PaginatedTransactionsResponse> {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
    if (filters.search) params.append('search', filters.search);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', String(filters.page));
    const limit = filters.limit || filters.pageSize;
    if (limit) params.append('limit', String(limit));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await ApiClient.get<any>(`/inventory/transactions${qs}`);

    if (Array.isArray(res)) {
      return {
        data: res,
        total: res.length,
        page: filters.page || 1,
        limit: limit || res.length || 10,
        totalPages: Math.max(1, Math.ceil(res.length / (limit || 10))),
      };
    }

    return {
      data: res?.data || res?.items || [],
      total: res?.total ?? (res?.data?.length || 0),
      page: res?.page || filters.page || 1,
      limit: res?.limit || limit || 10,
      totalPages: res?.totalPages || Math.max(1, Math.ceil((res?.total || 0) / (limit || 10))),
    };
  },

  async getById(id: string): Promise<InventoryTransaction> {
    return ApiClient.get<InventoryTransaction>(`/inventory/transactions/${id}`);
  },

  async create(data: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
    return ApiClient.post<InventoryTransaction>('/inventory/transactions', data);
  },

  async update(id: string, data: UpdateInventoryTransactionDto): Promise<InventoryTransaction> {
    return ApiClient.put<InventoryTransaction>(`/inventory/transactions/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/inventory/transactions/${id}`);
  },
};
