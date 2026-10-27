import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehousesService } from '../services';
import type { CreateWarehouseDto, UpdateWarehouseDto } from '../types';

export function useWarehousesQuery() {
  const queryClient = useQueryClient();

  const { data: warehouses = [], isLoading, error } = useQuery({
    queryKey: ['inventory', 'warehouses'],
    queryFn: () => warehousesService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateWarehouseDto) => warehousesService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDto }) =>
      warehousesService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => warehousesService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'warehouses'] }),
  });

  return {
    warehouses,
    isLoading,
    error,
    createWarehouse: createMutation.mutateAsync,
    updateWarehouse: updateMutation.mutateAsync,
    deleteWarehouse: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
