import { useCallback } from 'react';
import { useProductsStore } from '../../store';

export interface UseProductsDialogsProps {
  deleteProduct: (id: string) => Promise<void>;
}

export function useProductsDialogs({ deleteProduct }: UseProductsDialogsProps) {
  const {
    isDeleteConfirmOpen,
    productToDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
    isSuccessOpen,
    successMessage,
    showSuccess,
    closeSuccessDialog,
  } = useProductsStore();

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      closeDeleteConfirm();
      showSuccess(`El producto "${productToDelete.name}" fue eliminado.`);
    } catch {
      // Error handled by mutation hook
    }
  }, [productToDelete, deleteProduct, closeDeleteConfirm, showSuccess]);

  return {
    isDeleteConfirmOpen,
    productToDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteProduct,
    isSuccessOpen,
    successMessage,
    showSuccess,
    closeSuccessDialog,
  };
}
