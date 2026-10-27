import { useQuery } from '@tanstack/react-query';
import { purchasesService } from '../../services';
import type { Purchase } from '../../types';

export function usePurchasesQuery() {
  const {
    data = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Purchase[]>({
    queryKey: ['purchases'],
    queryFn: () => purchasesService.getAll(),
    staleTime: 1000 * 60 * 2,
  });

  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : String(queryError)
    : '';

  return {
    data,
    totalCount: data.length,
    loading: isLoading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
