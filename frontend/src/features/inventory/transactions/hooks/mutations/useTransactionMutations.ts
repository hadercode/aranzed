import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../../services';
import type {
  CreateInventoryTransactionDto,
  UpdateInventoryTransactionDto,
} from '../../types';

export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryTransactionDto) =>
      transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stocks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryTransactionDto }) =>
      transactionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stocks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'stocks'] });
    },
  });

  return {
    createTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

export default useTransactionMutations;
