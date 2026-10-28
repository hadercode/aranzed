import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductFormDataQuery } from '../queries/useProductFormDataQuery';
import { useProductsMutations } from '../mutations/useProductsMutations';
import { useProductForm } from './useProductForm';
import type { ProductFormData } from '../../schemas/product.schema';

export function useProductFormPage(productId?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(productId);

  // 1. Initial form data loading
  const {
    product,
    uoms,
    categories,
    loadingInitial,
    loadError,
    refetchInitial,
  } = useProductFormDataQuery(productId);

  // 2. Feedback dialog states
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 3. API Mutations
  const {
    createProduct,
    updateProduct,
    uploadProductImage,
    isMutating,
    isUploading,
    error: mutationError,
    uploadError,
    clearError: clearMutationError,
    clearUploadError,
  } = useProductsMutations();

  // 4. Form Submission Handler
  const handleFormSave = useCallback(
    async (formData: ProductFormData) => {
      clearMutationError();

      try {
        const payload = {
          name: formData.name.trim(),
          description: formData.description?.trim() || undefined,
          imageUrl: formData.imageUrl?.trim() || undefined,
          type: formData.type,
          uomId: formData.uomId,
          categoryId: formData.categoryId || undefined,
          profitMargin: Number(formData.profitMargin) || 0,
          lastCost: Number(formData.lastCost) || 0,
          lastSalePrice: Number(formData.lastSalePrice) || 0,
          isActive: formData.isActive,
        };

        if (productId) {
          await updateProduct(productId, payload);
          setSuccessMessage(
            `El producto "${formData.name}" ha sido actualizado con éxito.`
          );
        } else {
          await createProduct(payload);
          setSuccessMessage(
            `El producto "${formData.name}" ha sido creado con éxito.`
          );
        }

        setIsSuccessOpen(true);
      } catch {
        // Error state handled by useProductsMutations
      }
    },
    [productId, createProduct, updateProduct, clearMutationError]
  );

  // 5. Form State via React Hook Form & Zod
  const form = useProductForm({
    editingProduct: product,
    uoms,
    onSubmit: handleFormSave,
  });

  // 6. Reactive Watchers for Dynamic UI
  const selectedType = form.watch('type');
  const imageUrlValue = form.watch('imageUrl');
  const costValue = Number(form.watch('lastCost')) || 0;
  const salePriceValue = Number(form.watch('lastSalePrice')) || 0;
  const productNameValue = form.watch('name');

  // 7. Reactive Financial Statistics
  const grossProfit = Math.max(0, salePriceValue - costValue);
  const profitMarginPercent =
    costValue > 0 ? ((grossProfit / costValue) * 100).toFixed(1) : '0.0';
  const marginOnRevenuePercent =
    salePriceValue > 0
      ? ((grossProfit / salePriceValue) * 100).toFixed(1)
      : '0.0';

  // 8. Navigation & Dialog Helpers
  const handleCancel = useCallback(() => {
    navigate('/catalog/products');
  }, [navigate]);

  const closeSuccessDialog = useCallback(() => {
    setIsSuccessOpen(false);
    navigate('/catalog/products');
  }, [navigate]);

  return {
    productId,
    isEditing,
    product,
    uoms,
    categories,
    loadingInitial,
    loadError,
    refetchInitial,

    // Form controls
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.errors,
    setValue: form.setValue,
    watch: form.watch,
    getValues: form.getValues,
    isSubmitting: form.isSubmitting,
    isDirty: form.isDirty,

    // Watchers
    selectedType,
    imageUrlValue,
    costValue,
    salePriceValue,
    productNameValue,

    // Financial calculations & Handlers
    grossProfit,
    profitMarginPercent,
    marginOnRevenuePercent,
    handleCostChange: form.handleCostChange,
    handleMarginChange: form.handleMarginChange,
    handleSalePriceChange: form.handleSalePriceChange,

    // Mutations & Actions
    isMutating,
    mutationError,
    clearMutationError,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    handleSave: form.handleSubmit,
    handleCancel,

    // Feedback dialog
    isSuccessOpen,
    successMessage,
    closeSuccessDialog,
  };
}
