import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesService } from '../../services';
import type { PurchasePayload } from '../../services';
import type { Purchase, PurchaseStatus } from '../../types';

export function usePurchasesMutations() {
  const queryClient = useQueryClient();

  // 1. Mutación: Crear compra
  const createMutation = useMutation<Purchase, Error, PurchasePayload>({
    mutationFn: (payload: PurchasePayload) => purchasesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });

  // 2. Mutación: Actualizar compra existente
  const updateMutation = useMutation<Purchase, Error, { id: string; payload: PurchasePayload }>({
    mutationFn: ({ id, payload }: { id: string; payload: PurchasePayload }) =>
      purchasesService.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', variables.id] });
    },
  });

  // 3. Mutación: Actualizar estado de compra
  const updateStatusMutation = useMutation<Purchase, Error, { id: string; status: PurchaseStatus }>({
    mutationFn: ({ id, status }: { id: string; status: PurchaseStatus }) =>
      purchasesService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', variables.id] });
    },
  });

  // 4. Mutación: Eliminar borrador de compra
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => purchasesService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
    },
  });

  // Estado unificado de carga
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  // Error consolidado
  const activeError =
    createMutation.error ||
    updateMutation.error ||
    updateStatusMutation.error ||
    deleteMutation.error;

  const error = activeError ? (activeError instanceof Error ? activeError.message : String(activeError)) : null;

  // Limpiar estados de error
  const clearError = () => {
    createMutation.reset();
    updateMutation.reset();
    updateStatusMutation.reset();
    deleteMutation.reset();
  };

  return {
    createPurchase: (payload: PurchasePayload) => createMutation.mutateAsync(payload),
    updatePurchase: (id: string, payload: PurchasePayload) => updateMutation.mutateAsync({ id, payload }),
    updateStatus: (id: string, status: PurchaseStatus) =>
      updateStatusMutation.mutateAsync({ id, status }),
    deletePurchase: (id: string) => deleteMutation.mutateAsync(id),

    // Instancias granulares de TanStack Query
    createMutation,
    updateMutation,
    updateStatusMutation,
    deleteMutation,

    // Estados compatibles
    isMutating,
    error,
    clearError,
  };
}
