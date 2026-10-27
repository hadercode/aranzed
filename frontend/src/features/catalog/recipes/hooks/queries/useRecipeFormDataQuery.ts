import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
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
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setLoadingInitial(true);
        setLoadError('');
      }

      try {
        const promises: [Promise<Product[]>, Promise<Recipe | null>] = [
          ApiClient.get<Product[]>('/catalog/products').catch(() => []),
          recipeId
            ? ApiClient.get<Recipe>(`/catalog/recipes/${recipeId}`)
            : Promise.resolve(null),
        ];

        const [productsRes, recipeRes] = await Promise.all(promises);

        setProducts(productsRes || []);
        setRecipe(recipeRes);
        setLoadError('');
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Error al cargar los datos de la receta';
        setLoadError(msg);
      } finally {
        setLoadingInitial(false);
      }
    },
    [recipeId]
  );

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      try {
        setLoadingInitial(true);
        setLoadError('');

        const promises: [Promise<Product[]>, Promise<Recipe | null>] = [
          ApiClient.get<Product[]>('/catalog/products').catch(() => []),
          recipeId
            ? ApiClient.get<Recipe>(`/catalog/recipes/${recipeId}`)
            : Promise.resolve(null),
        ];

        const [productsRes, recipeRes] = await Promise.all(promises);

        if (isMounted) {
          setProducts(productsRes || []);
          setRecipe(recipeRes);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
              ? err
              : 'Error al cargar los datos de la receta';
          setLoadError(msg);
        }
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
        }
      }
    }

    initialFetch();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  return {
    recipe,
    products,
    loadingInitial,
    loadError,
    refetchInitial: () => loadData(true),
  };
}
