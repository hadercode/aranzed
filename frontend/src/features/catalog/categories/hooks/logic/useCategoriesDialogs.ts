import { useCallback } from 'react';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import type { Category } from '../../types';

export interface UseCategoriesDialogsProps {
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategoriesDialogs({ deleteCategory }: UseCategoriesDialogsProps) {
  const store = useCategoriesStore();

  const showSuccess = useCallback(
    (message: string) => {
      store.showSuccess(message);
    },
    [store]
  );

  const handleCloseSuccess = useCallback(() => {
    store.closeSuccessDialog();
  }, [store]);

  const handleOpenDelete = useCallback(
    (category: Category) => {
      store.openDeleteConfirm(category);
    },
    [store]
  );

  const handleCloseDelete = useCallback(() => {
    store.closeDeleteConfirm();
  }, [store]);

  const handleConfirmDelete = useCallback(async () => {
    if (!store.categoryToDelete) return;
    try {
      const catName = store.categoryToDelete.name;
      await deleteCategory(store.categoryToDelete.id);
      store.closeDeleteConfirm();
      store.showSuccess(`Categoría "${catName}" eliminada correctamente.`);
    } catch {
      // Handled in mutation hook
    }
  }, [store, deleteCategory]);

  return {
    isDeleteConfirmOpen: store.isDeleteConfirmOpen,
    categoryToDelete: store.categoryToDelete,
    isSuccessOpen: store.isSuccessOpen,
    successMessage: store.successMessage,
    showSuccess,
    handleCloseSuccess,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
