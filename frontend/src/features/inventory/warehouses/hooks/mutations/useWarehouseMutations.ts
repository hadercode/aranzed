import { useMutation, useQueryClient } from '@tanstack/react-query';
import { warehousesService } from '../../services';
import { WAREHOUSES_QUERY_KEY } from '../queries/useWarehousesQuery';
import type { CreateWarehouseDto, UpdateWarehouseDto } from '../../types';

export function useWarehouseMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateWarehouseDto) => warehousesService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDto }) =>
      warehousesService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => warehousesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });

  return {
    createWarehouse: createMutation.mutateAsync,
    updateWarehouse: updateMutation.mutateAsync,
    deleteWarehouse: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

