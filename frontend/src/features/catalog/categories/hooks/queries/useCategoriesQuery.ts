import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../../services';
import type { Category } from '../../types';

export const CATEGORIES_QUERY_KEY = ['catalog', 'categories'] as const;

export function useCategoriesQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : typeof queryError === 'string'
      ? queryError
      : 'Error al cargar las categorías'
    : '';

  return {
    data,
    loading: isLoading,
    isFetching,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}

export function useCategoryQuery(id?: string) {
  return useQuery<Category, Error>({
    queryKey: [...CATEGORIES_QUERY_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('ID de categoría requerido');
      return categoriesService.getById(id);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}
