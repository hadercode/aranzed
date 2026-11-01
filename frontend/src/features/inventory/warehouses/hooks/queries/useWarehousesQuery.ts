import { useQuery } from '@tanstack/react-query';
import { warehousesService } from '../../services';
import type { Warehouse } from '../../types';

export const WAREHOUSES_QUERY_KEY = ['inventory', 'warehouses'] as const;

export function useWarehousesQuery() {
  const { data: warehouses = [], isLoading, error, refetch } = useQuery<Warehouse[]>({
    queryKey: WAREHOUSES_QUERY_KEY,
    queryFn: () => warehousesService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    warehouses,
    isLoading,
    error,
    refetch,
  };
}

