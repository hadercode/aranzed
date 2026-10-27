import { useMutation, useQueryClient } from '@tanstack/react-query';
import { salesPaymentsService } from '../../services';
import type {
  CreateSalePaymentPayload,
  CloseSaleManuallyPayload,
} from '../../types';

export function useSalePaymentMutations() {
  const queryClient = useQueryClient();

  const invalidatePaymentsAndSales = () => {
    queryClient.invalidateQueries({ queryKey: ['sale-payments'] });
    queryClient.invalidateQueries({ queryKey: ['sales'] });
  };

  const createPaymentMutation = useMutation({
    mutationFn: (data: CreateSalePaymentPayload) =>
      salesPaymentsService.create(data),
    onSuccess: invalidatePaymentsAndSales,
  });

  const uploadReceiptMutation = useMutation({
    mutationFn: (file: File) => salesPaymentsService.uploadReceipt(file),
  });

  const closeSaleManuallyMutation = useMutation({
    mutationFn: ({
      saleId,
      data,
    }: {
      saleId: string;
      data: CloseSaleManuallyPayload;
    }) => salesPaymentsService.closeSaleManually(saleId, data),
    onSuccess: invalidatePaymentsAndSales,
  });

  const cancelPaymentMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      salesPaymentsService.cancel(id, reason),
    onSuccess: invalidatePaymentsAndSales,
  });

  return {
    createPayment: createPaymentMutation.mutateAsync,
    uploadReceipt: uploadReceiptMutation.mutateAsync,
    closeSaleManually: closeSaleManuallyMutation.mutateAsync,
    cancelPayment: cancelPaymentMutation.mutateAsync,

    isCreating: createPaymentMutation.isPending,
    isUploading: uploadReceiptMutation.isPending,
    isClosing: closeSaleManuallyMutation.isPending,
    isCancelling: cancelPaymentMutation.isPending,

    createError: createPaymentMutation.error,
    uploadError: uploadReceiptMutation.error,
    closeError: closeSaleManuallyMutation.error,
    cancelError: cancelPaymentMutation.error,

    resetErrors: () => {
      createPaymentMutation.reset();
      uploadReceiptMutation.reset();
      closeSaleManuallyMutation.reset();
      cancelPaymentMutation.reset();
    },
  };
}
