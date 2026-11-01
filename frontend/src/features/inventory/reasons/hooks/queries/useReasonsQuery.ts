import { useQuery } from '@tanstack/react-query';
import { reasonsService } from '../../services';
import type { InventoryReason } from '../../types';

export const REASONS_QUERY_KEY = ['inventory', 'reasons'] as const;

export function useReasonsQuery() {
  const { data: reasons = [], isLoading, error, refetch } = useQuery<InventoryReason[]>({
    queryKey: REASONS_QUERY_KEY,
    queryFn: () => reasonsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    reasons,
    isLoading,
    error,
    refetch,
  };
}

