import { ApiClient } from '@/lib/api-client';
import type { UnitOfMeasure, CreateUomDto, UpdateUomDto } from '../types';

export const unitsOfMeasureService = {
  async getAll(): Promise<UnitOfMeasure[]> {
    return ApiClient.get<UnitOfMeasure[]>('/catalog/uofm');
  },

  async getById(id: string): Promise<UnitOfMeasure> {
    return ApiClient.get<UnitOfMeasure>(`/catalog/uofm/${id}`);
  },

  async create(data: CreateUomDto): Promise<UnitOfMeasure> {
    return ApiClient.post<UnitOfMeasure>('/catalog/uofm', data);
  },

  async update(id: string, data: UpdateUomDto): Promise<UnitOfMeasure> {
    return ApiClient.put<UnitOfMeasure>(`/catalog/uofm/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/catalog/uofm/${id}`);
  },
};
