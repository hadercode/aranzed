import { useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '../../services';
import type { SaleFormData } from '../../schemas';
import type { SalePaidStatus, SaleStatus } from '../../types';

export function useSaleMutations() {
  const queryClient = useQueryClient();

  const invalidateSales = () => {
    queryClient.invalidateQueries({ queryKey: ['sales'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: SaleFormData) => salesService.create(data),
    onSuccess: invalidateSales,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SaleFormData }) =>
      salesService.update(id, data),
    onSuccess: invalidateSales,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      cancelReason,
    }: {
      id: string;
      status: SaleStatus;
      cancelReason?: string;
    }) => salesService.updateStatus(id, status, cancelReason),
    onSuccess: invalidateSales,
  });

  const updatePaidStatusMutation = useMutation({
    mutationFn: ({
      id,
      paidStatus,
    }: {
      id: string;
      paidStatus: SalePaidStatus;
    }) => salesService.updatePaidStatus(id, paidStatus),
    onSuccess: invalidateSales,
  });

  const convertQuotationMutation = useMutation({
    mutationFn: (id: string) => salesService.convertQuotation(id),
    onSuccess: invalidateSales,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => salesService.delete(id),
    onSuccess: invalidateSales,
  });

  return {
    createSale: createMutation.mutateAsync,
    updateSale: updateMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    updatePaidStatus: updatePaidStatusMutation.mutateAsync,
    convertQuotation: convertQuotationMutation.mutateAsync,
    deleteSale: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isChangingStatus: updateStatusMutation.isPending,
    isChangingPaidStatus: updatePaidStatusMutation.isPending,
    isConverting: convertQuotationMutation.isPending,
    isDeleting: deleteMutation.isPending,
    mutationError:
      createMutation.error ||
      updateMutation.error ||
      updateStatusMutation.error ||
      updatePaidStatusMutation.error ||
      convertQuotationMutation.error ||
      deleteMutation.error,
  };
}
