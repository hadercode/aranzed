import { ApiClient } from '@/lib/api-client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return ApiClient.get<Category[]>('/catalog/categories');
  },

  async getById(id: string): Promise<Category> {
    return ApiClient.get<Category>(`/catalog/categories/${id}`);
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    return ApiClient.post<Category>('/catalog/categories', data);
  },

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return ApiClient.put<Category>(`/catalog/categories/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/catalog/categories/${id}`);
  },
};
