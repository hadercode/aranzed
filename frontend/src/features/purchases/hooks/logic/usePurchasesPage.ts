import { useCallback } from 'react';
import { usePurchasesQuery } from '../queries/usePurchasesQuery';
import { usePurchasesMutations } from '../mutations/usePurchasesMutations';
import { usePurchasesStats } from './usePurchasesStats';
import { usePurchasesStore } from '../../store';
import { usePurchasesTableUrlSync } from './usePurchasesTableUrlSync';
import { usePurchasesFilterSort } from './usePurchasesFilterSort';

export function usePurchasesPage() {
  const { data: purchases, loading, error, refetch } = usePurchasesQuery();
  const { updateStatus, deletePurchase, isMutating } = usePurchasesMutations();
  const { stats } = usePurchasesStats(purchases);

  const {
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    completePurchaseTarget,
    deletePurchaseTarget,
    actionFeedback,
    actionError,
    setCurrentPage,
    setPageSize,
    setSort,
    openCompleteModal,
    closeCompleteModal,
    openDeleteModal,
    closeDeleteModal,
    setActionFeedback,
    setActionError,
    clearFeedback,
    clearActionError,
  } = usePurchasesStore();

  const {
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  } = usePurchasesTableUrlSync();

  const { filteredPurchases, paginatedPurchases, totalPages } = usePurchasesFilterSort({
    purchases,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
  });

  const handleConfirmComplete = useCallback(async () => {
    if (!completePurchaseTarget) return;
    try {
      await updateStatus(completePurchaseTarget.id, 'COMPLETED');
      setActionFeedback(
        `Compra #${completePurchaseTarget.purchaseNumber} completada exitosamente. Evento emitido para inventario.`
      );
      closeCompleteModal();
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al completar la compra';
      setActionError(msg);
    }
  }, [completePurchaseTarget, updateStatus, setActionFeedback, setActionError, closeCompleteModal, refetch]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletePurchaseTarget) return;
    try {
      await deletePurchase(deletePurchaseTarget.id);
      setActionFeedback(`Compra #${deletePurchaseTarget.purchaseNumber} eliminada correctamente.`);
      closeDeleteModal();
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la compra';
      setActionError(msg);
    }
  }, [deletePurchaseTarget, deletePurchase, setActionFeedback, setActionError, closeDeleteModal, refetch]);

  return {
    purchases,
    loading,
    error,
    refetch,
    searchTerm,
    statusFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    setPageSize,
    setSort,
    totalPages,
    filteredPurchases,
    paginatedPurchases,
    handleSearchChange,
    handleStatusFilterChange,
    setCurrentPage,
    stats,
    completePurchaseTarget,
    deletePurchaseTarget,
    actionFeedback,
    actionError,
    openCompleteModal,
    closeCompleteModal,
    handleConfirmComplete,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
    clearFeedback,
    clearActionError,
    isMutating,
  };
}

export type UsePurchasesPageReturn = ReturnType<typeof usePurchasesPage>;
