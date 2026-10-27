import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Recipe } from '../../types';

export function useRecipesMutations() {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createRecipe = useCallback(async (payload: any): Promise<Recipe> => {
    setIsMutating(true);
    setError(null);
    try {
      const res = await ApiClient.post<Recipe>('/catalog/recipes', payload);
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al crear la receta';
      setError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateRecipe = useCallback(
    async (id: string, payload: any): Promise<Recipe> => {
      setIsMutating(true);
      setError(null);
      try {
        const res = await ApiClient.put<Recipe>(`/catalog/recipes/${id}`, payload);
        return res;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al actualizar la receta';
        setError(msg);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const deleteRecipe = useCallback(async (id: string): Promise<void> => {
    setIsMutating(true);
    setError(null);
    try {
      await ApiClient.delete(`/catalog/recipes/${id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al eliminar la receta';
      setError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const syncCost = useCallback(async (id: string): Promise<Recipe> => {
    setIsMutating(true);
    setError(null);
    try {
      const res = await ApiClient.post<Recipe>(`/catalog/recipes/${id}/sync-cost`, {});
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al sincronizar el costo';
      setError(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    createRecipe,
    updateRecipe,
    deleteRecipe,
    syncCost,
    isMutating,
    error,
    clearError,
  };
}
