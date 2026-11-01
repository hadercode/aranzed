import { useQuery } from '@tanstack/react-query';
import { unitsOfMeasureService } from '../../services';
import type { UnitOfMeasure } from '../../types';

export const UOMS_QUERY_KEY = ['catalog', 'uofm'] as const;

export function useUnitsOfMeasureQuery() {
  const query = useQuery<UnitOfMeasure[], Error>({
    queryKey: UOMS_QUERY_KEY,
    queryFn: () => unitsOfMeasureService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const error = query.error
    ? query.error.message || 'Error al cargar las unidades de medida'
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
