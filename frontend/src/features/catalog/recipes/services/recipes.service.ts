import { ApiClient } from '@/lib/api-client';
import type { Recipe } from '../types';

interface RecipesApiResponse {
  recipes: Recipe[];
  total: number;
}

export const recipesService = {
  async getAll(): Promise<Recipe[]> {
    const res = await ApiClient.get<RecipesApiResponse | Recipe[]>('/catalog/recipes');
    return Array.isArray(res) ? res : res?.recipes || [];
  },

  async getById(id: string): Promise<Recipe> {
    return ApiClient.get<Recipe>(`/catalog/recipes/${id}`);
  },

  async create(payload: unknown): Promise<Recipe> {
    return ApiClient.post<Recipe>('/catalog/recipes', payload);
  },

  async update(id: string, payload: unknown): Promise<Recipe> {
    return ApiClient.put<Recipe>(`/catalog/recipes/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`/catalog/recipes/${id}`);
  },

  async syncCost(id: string): Promise<Recipe> {
    return ApiClient.post<Recipe>(`/catalog/recipes/${id}/sync-cost`, {});
  },
};

