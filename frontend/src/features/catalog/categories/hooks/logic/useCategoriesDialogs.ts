import { useState, useCallback } from 'react';
import type { Category } from '../../types';

export interface UseCategoriesDialogsProps {
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategoriesDialogs({ deleteCategory }: UseCategoriesDialogsProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  }, []);

  const handleOpenDelete = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      setIsDeleteConfirmOpen(false);
      showSuccess(`Categoría "${categoryToDelete.name}" eliminada correctamente.`);
      setCategoryToDelete(null);
    } catch {
      // Handled in mutation hook
    }
  }, [categoryToDelete, deleteCategory, showSuccess]);

  return {
    isDeleteConfirmOpen,
    categoryToDelete,
    isSuccessOpen,
    successMessage,
    showSuccess,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    handleCloseSuccess,
  };
}
