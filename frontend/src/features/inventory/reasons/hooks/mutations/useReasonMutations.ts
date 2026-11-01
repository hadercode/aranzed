import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reasonsService } from '../../services';
import { REASONS_QUERY_KEY } from '../queries/useReasonsQuery';
import type { CreateInventoryReasonDto, UpdateInventoryReasonDto } from '../../types';

export function useReasonMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryReasonDto) => reasonsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REASONS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryReasonDto }) =>
      reasonsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REASONS_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reasonsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REASONS_QUERY_KEY }),
  });

  return {
    createReason: createMutation.mutateAsync,
    updateReason: updateMutation.mutateAsync,
    deleteReason: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

