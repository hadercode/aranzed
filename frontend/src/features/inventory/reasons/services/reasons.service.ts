import { ApiClient } from '@/lib/api-client';
import type { InventoryReason, CreateInventoryReasonDto, UpdateInventoryReasonDto } from '../types';

export const reasonsService = {
  async getAll(): Promise<InventoryReason[]> {
    return ApiClient.get<InventoryReason[]>('/inventory/reasons');
  },

  async getById(id: string): Promise<InventoryReason> {
    return ApiClient.get<InventoryReason>(`/inventory/reasons/${id}`);
  },

  async create(data: CreateInventoryReasonDto): Promise<InventoryReason> {
    return ApiClient.post<InventoryReason>('/inventory/reasons', data);
  },

  async update(id: string, data: UpdateInventoryReasonDto): Promise<InventoryReason> {
    return ApiClient.put<InventoryReason>(`/inventory/reasons/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/inventory/reasons/${id}`);
  },
};
