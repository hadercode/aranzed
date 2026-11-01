import { useQuery } from '@tanstack/react-query';
import { recipesService } from '../../services';
import { productsService } from '@/features/catalog/products/services';
import type { Recipe } from '../../types';
import type { Product } from '@/features/catalog/products/types';

export interface UseRecipeFormDataQueryResult {
  recipe: Recipe | null;
  products: Product[];
  loadingInitial: boolean;
  loadError: string;
  refetchInitial: () => Promise<void>;
}

export function useRecipeFormDataQuery(recipeId?: string): UseRecipeFormDataQueryResult {
  const productsQuery = useQuery<Product[], Error>({
    queryKey: ['catalog', 'products'],
    queryFn: () => productsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const recipeQuery = useQuery<Recipe | null, Error>({
    queryKey: ['catalog', 'recipes', recipeId],
    queryFn: () => (recipeId ? recipesService.getById(recipeId) : Promise.resolve(null)),
    enabled: Boolean(recipeId),
    staleTime: 1000 * 60 * 5,
  });

  const loadingInitial = productsQuery.isLoading || (Boolean(recipeId) && recipeQuery.isLoading);

  const errorObj = productsQuery.error || recipeQuery.error;
  const loadError = errorObj
    ? errorObj.message || 'Error al cargar los datos de la receta'
    : '';

  const refetchInitial = async () => {
    await Promise.all([
      productsQuery.refetch(),
      recipeId ? recipeQuery.refetch() : Promise.resolve(),
    ]);
  };

  return {
    recipe: recipeQuery.data ?? null,
    products: productsQuery.data ?? [],
    loadingInitial,
    loadError,
    refetchInitial,
  };
}
