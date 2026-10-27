import { useState, useCallback } from 'react';
import type { Purchase } from '../../types';
import { usePurchasesMutations } from '../mutations/usePurchasesMutations';

export interface UsePurchasesActionsProps {
  onRefresh: () => void;
}

export function usePurchasesActions({ onRefresh }: UsePurchasesActionsProps) {
  const { updateStatus, deletePurchase, isMutating, error, clearError } =
    usePurchasesMutations();

  // Complete modal
  const [completePurchaseTarget, setCompletePurchaseTarget] = useState<Purchase | null>(null);
  // Delete modal
  const [deletePurchaseTarget, setDeletePurchaseTarget] = useState<Purchase | null>(null);
  // Feedback
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const openCompleteModal = useCallback((p: Purchase) => {
    setCompletePurchaseTarget(p);
  }, []);

  const closeCompleteModal = useCallback(() => {
    setCompletePurchaseTarget(null);
  }, []);

  const handleConfirmComplete = useCallback(async () => {
    if (!completePurchaseTarget) return;
    try {
      await updateStatus(completePurchaseTarget.id, 'COMPLETED');
      setActionFeedback(
        `Compra #${completePurchaseTarget.purchaseNumber} completada exitosamente. Evento emitido para inventario.`
      );
      closeCompleteModal();
      onRefresh();
    } catch {
      // Error handled in hook
    }
  }, [completePurchaseTarget, updateStatus, closeCompleteModal, onRefresh]);

  const openDeleteModal = useCallback((p: Purchase) => {
    setDeletePurchaseTarget(p);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletePurchaseTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletePurchaseTarget) return;
    try {
      await deletePurchase(deletePurchaseTarget.id);
      setActionFeedback(`Compra #${deletePurchaseTarget.purchaseNumber} eliminada correctamente.`);
      closeDeleteModal();
      onRefresh();
    } catch {
      // Error handled in hook
    }
  }, [deletePurchaseTarget, deletePurchase, closeDeleteModal, onRefresh]);

  const clearFeedback = useCallback(() => {
    setActionFeedback(null);
  }, []);

  return {
    isMutating,
    actionError: error,
    clearActionError: clearError,
    actionFeedback,
    clearFeedback,
    completePurchaseTarget,
    openCompleteModal,
    closeCompleteModal,
    handleConfirmComplete,
    deletePurchaseTarget,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  };
}
