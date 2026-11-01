import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '../../services';
import { RECIPES_QUERY_KEY } from '../queries/useRecipesQuery';
import type { Recipe } from '../../types';

export interface UseRecipesMutationsOptions {
  onSuccess?: () => void;
}

export function useRecipesMutations(options: UseRecipesMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateRecipes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: RECIPES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['catalog', 'products'] });
    options.onSuccess?.();
  }, [queryClient, options]);

  // 1. Create Mutation
  const createMutation = useMutation<Recipe, Error, unknown>({
    mutationFn: (payload: unknown) => recipesService.create(payload),
    onSuccess: invalidateRecipes,
  });

  // 2. Update Mutation
  const updateMutation = useMutation<Recipe, Error, { id: string; payload: unknown }>({
    mutationFn: ({ id, payload }) => recipesService.update(id, payload),
    onSuccess: invalidateRecipes,
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => recipesService.delete(id),
    onSuccess: invalidateRecipes,
  });

  // 4. Sync Cost Mutation
  const syncCostMutation = useMutation<Recipe, Error, string>({
    mutationFn: (id: string) => recipesService.syncCost(id),
    onSuccess: invalidateRecipes,
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    syncCostMutation.isPending;

  const currentError =
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error ||
    syncCostMutation.error;
  const error = currentError
    ? currentError.message || 'Error en la operación de receta'
    : null;

  const clearError = useCallback(() => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
    syncCostMutation.reset();
  }, [createMutation, updateMutation, deleteMutation, syncCostMutation]);

  const createRecipe = useCallback(
    async (payload: unknown): Promise<Recipe> => {
      return createMutation.mutateAsync(payload);
    },
    [createMutation]
  );

  const updateRecipe = useCallback(
    async (id: string, payload: unknown): Promise<Recipe> => {
      return updateMutation.mutateAsync({ id, payload });
    },
    [updateMutation]
  );

  const deleteRecipe = useCallback(
    async (id: string): Promise<void> => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const syncCost = useCallback(
    async (id: string): Promise<Recipe> => {
      return syncCostMutation.mutateAsync(id);
    },
    [syncCostMutation]
  );

  return {
    isMutating,
    error,
    clearError,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    syncCost,
    createMutation,
    updateMutation,
    deleteMutation,
    syncCostMutation,
  };
}
