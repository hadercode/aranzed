import { ApiClient } from '@/lib/api-client';
import type { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '../types';

export const warehousesService = {
  async getAll(): Promise<Warehouse[]> {
    return ApiClient.get<Warehouse[]>('/inventory/warehouses');
  },

  async getById(id: string): Promise<Warehouse> {
    return ApiClient.get<Warehouse>(`/inventory/warehouses/${id}`);
  },

  async create(data: CreateWarehouseDto): Promise<Warehouse> {
    return ApiClient.post<Warehouse>('/inventory/warehouses', data);
  },

  async update(id: string, data: UpdateWarehouseDto): Promise<Warehouse> {
    return ApiClient.put<Warehouse>(`/inventory/warehouses/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/inventory/warehouses/${id}`);
  },
};
