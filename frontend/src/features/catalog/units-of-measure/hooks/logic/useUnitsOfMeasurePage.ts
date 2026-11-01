import { useMemo, useCallback } from 'react';
import { useUnitsOfMeasureQuery } from '../queries/useUnitsOfMeasureQuery';
import { useUnitsOfMeasureMutations } from '../mutations/useUnitsOfMeasureMutations';
import { useUnitsOfMeasureStore } from '../../store/useUnitsOfMeasureStore';
import { useUnitsOfMeasureStats } from './useUnitsOfMeasureStats';
import { useUnitsOfMeasureFormModal } from './useUnitsOfMeasureFormModal';
import type { UnitOfMeasure, UomStatusFilter, UomDecimalsFilter } from '../../types';

export function useUnitsOfMeasurePage() {
  const { data: uoms, loading, error: fetchError, refetch } = useUnitsOfMeasureQuery();
  const store = useUnitsOfMeasureStore();

  const {
    createUom,
    updateUom,
    deleteUom,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useUnitsOfMeasureMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  const stats = useUnitsOfMeasureStats(uoms);
  const formModal = useUnitsOfMeasureFormModal({
    createUom,
    updateUom,
    clearMutationError,
  });

  const filteredUoms = useMemo(() => {
    return uoms.filter((uom) => {
      if (store.searchTerm.trim()) {
        const query = store.searchTerm.toLowerCase().trim();
        const matchesCode = uom.code.toLowerCase().includes(query);
        const matchesName = uom.name.toLowerCase().includes(query);
        if (!matchesCode && !matchesName) return false;
      }
      if (store.statusFilter === 'active' && !uom.isActive) return false;
      if (store.statusFilter === 'inactive' && uom.isActive) return false;
      if (store.decimalsFilter === 'decimals' && !uom.allowDecimals) return false;
      if (store.decimalsFilter === 'integers' && uom.allowDecimals) return false;
      return true;
    });
  }, [uoms, store.searchTerm, store.statusFilter, store.decimalsFilter]);

  const paginatedUoms = useMemo(() => {
    const startIndex = (store.currentPage - 1) * store.itemsPerPage;
    return filteredUoms.slice(startIndex, startIndex + store.itemsPerPage);
  }, [filteredUoms, store.currentPage, store.itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUoms.length / store.itemsPerPage));
  }, [filteredUoms.length, store.itemsPerPage]);

  const handleOpenDelete = useCallback(
    (uom: UnitOfMeasure) => {
      clearMutationError();
      store.openDeleteConfirm(uom);
    },
    [clearMutationError, store]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!store.uomToDelete) return;
    try {
      await deleteUom(store.uomToDelete.id);
      store.showSuccess(`Unidad "${store.uomToDelete.code}" eliminada.`);
      store.closeDeleteConfirm();
    } catch {
      // Handled in mutation hook
    }
  }, [store, deleteUom]);

  return {
    uoms,
    filteredUoms,
    paginatedUoms,
    stats,
    loading,
    fetchError,
    refetch,
    isMutating,
    mutationError,
    searchTerm: store.searchTerm,
    statusFilter: store.statusFilter,
    decimalsFilter: store.decimalsFilter,
    currentPage: store.currentPage,
    totalPages,
    itemsPerPage: store.itemsPerPage,
    isFormModalOpen: store.isFormModalOpen,
    editingUom: store.editingUom,
    formData: store.formData,
    formErrors: store.formErrors,
    isDeleteConfirmOpen: store.isDeleteConfirmOpen,
    uomToDelete: store.uomToDelete,
    isSuccessOpen: store.isSuccessOpen,
    successMessage: store.successMessage,
    handleSearchChange: (v: string) => store.setSearchTerm(v),
    handleStatusFilterChange: (v: UomStatusFilter) => store.setStatusFilter(v),
    handleDecimalsFilterChange: (v: UomDecimalsFilter) => store.setDecimalsFilter(v),
    handleItemsPerPageChange: (v: number) => store.setItemsPerPage(v),
    handleResetFilters: () => store.resetFilters(),
    setCurrentPage: (p: number) => store.setCurrentPage(p),
    handleOpenCreate: formModal.handleOpenCreate,
    handleOpenEdit: formModal.handleOpenEdit,
    handleCloseForm: formModal.handleCloseForm,
    handleFormChange: formModal.handleFormChange,
    handleFormSubmit: formModal.handleFormSubmit,
    handleOpenDelete,
    handleCloseDelete: () => store.closeDeleteConfirm(),
    handleConfirmDelete,
    handleCloseSuccess: () => store.closeSuccessDialog(),
  };
}

export default useUnitsOfMeasurePage;
