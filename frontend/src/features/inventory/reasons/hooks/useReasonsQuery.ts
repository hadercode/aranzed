import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reasonsService } from '../services';
import type { CreateInventoryReasonDto, UpdateInventoryReasonDto } from '../types';

export function useReasonsQuery() {
  const queryClient = useQueryClient();

  const { data: reasons = [], isLoading, error } = useQuery({
    queryKey: ['inventory', 'reasons'],
    queryFn: () => reasonsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryReasonDto) => reasonsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'reasons'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryReasonDto }) =>
      reasonsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'reasons'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reasonsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory', 'reasons'] }),
  });

  return {
    reasons,
    isLoading,
    error,
    createReason: createMutation.mutateAsync,
    updateReason: updateMutation.mutateAsync,
    deleteReason: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
