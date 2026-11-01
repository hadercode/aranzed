import { useQuery } from '@tanstack/react-query';
import { recipesService } from '../../services';
import type { Recipe } from '../../types';

export const RECIPES_QUERY_KEY = ['catalog', 'recipes'] as const;

export function useRecipesQuery() {
  const query = useQuery<Recipe[], Error>({
    queryKey: RECIPES_QUERY_KEY,
    queryFn: () => recipesService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const error = query.error
    ? query.error.message || 'Error al cargar las recetas'
    : '';

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error,
    refetch: async () => {
      await query.refetch();
    },
    isFetching: query.isFetching,
    query,
  };
}

export function useRecipeQuery(id?: string) {
  return useQuery<Recipe, Error>({
    queryKey: [...RECIPES_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('ID de receta requerido');
      return recipesService.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
