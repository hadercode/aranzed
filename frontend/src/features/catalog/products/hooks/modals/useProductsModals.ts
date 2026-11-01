import { useCallback } from 'react';
import { useProductsStore } from '../../store';
import type {
  Product,
  ProductType,
  CreateProductDto,
  UpdateProductDto,
} from '../../types';

export interface UseProductsModalsProps {
  createProduct: (dto: CreateProductDto) => Promise<Product>;
  updateProduct: (id: string, dto: UpdateProductDto) => Promise<Product>;
  uploadProductImage: (file: File) => Promise<string>;
  isUploading: boolean;
  uploadError: string;
  clearUploadError: () => void;
  clearMutationError: () => void;
  onSuccess: (message: string) => void;
}

export function useProductsModals({
  createProduct,
  updateProduct,
  uploadProductImage,
  isUploading,
  uploadError,
  clearUploadError,
  clearMutationError,
  onSuccess,
}: UseProductsModalsProps) {
  const {
    isFormModalOpen,
    editingProduct,
    isBulkImportOpen,
    openCreateModal: storeOpenCreateModal,
    openEditModal: storeOpenEditModal,
    closeFormModal,
    openBulkImportModal,
    closeBulkImportModal,
  } = useProductsStore();

  const openCreateModal = useCallback(() => {
    clearMutationError();
    storeOpenCreateModal();
  }, [clearMutationError, storeOpenCreateModal]);

  const openEditModal = useCallback(
    (product: Product) => {
      clearMutationError();
      storeOpenEditModal(product);
    },
    [clearMutationError, storeOpenEditModal]
  );

  const handleSaveProduct = useCallback(
    async (data: {
      name: string;
      type: ProductType;
      uomId: string;
      description?: string;
      imageUrl?: string;
      categoryId?: string;
      profitMargin: number;
      lastCost: number;
      lastSalePrice: number;
      isActive: boolean;
      isForSale?: boolean;
      isForInternalUse?: boolean;
      manageInventory?: boolean;
    }) => {
      try {
        const payload = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
          imageUrl: data.imageUrl?.trim() || undefined,
          type: data.type,
          uomId: data.uomId,
          categoryId: data.categoryId || undefined,
          profitMargin: Number(data.profitMargin) || 0,
          lastCost: Number(data.lastCost) || 0,
          lastSalePrice: Number(data.lastSalePrice) || 0,
          isActive: data.isActive,
          isForSale: data.isForSale,
          isForInternalUse: data.isForInternalUse,
          manageInventory: data.manageInventory,
        };

        if (editingProduct) {
          await updateProduct(editingProduct.id, payload);
          onSuccess(`El producto "${data.name}" ha sido actualizado correctamente.`);
        } else {
          await createProduct(payload);
          onSuccess(`El producto "${data.name}" ha sido creado con éxito.`);
        }

        closeFormModal();
      } catch {
        // Error handled by mutation hook
      }
    },
    [editingProduct, createProduct, updateProduct, onSuccess, closeFormModal]
  );

  return {
    isFormModalOpen,
    openCreateModal,
    openEditModal,
    closeFormModal,
    editingProduct,
    isBulkImportOpen,
    openBulkImportModal,
    closeBulkImportModal,
    handleSaveProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
  };
}
