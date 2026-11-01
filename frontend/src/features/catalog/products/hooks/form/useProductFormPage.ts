import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductFormDataQuery } from '../queries/useProductFormDataQuery';
import { useProductsMutations } from '../mutations/useProductsMutations';
import { useProductFormStore } from '../../store';
import { useProductForm } from './useProductForm';
import {
  calculateGrossProfit,
  calculateMarginOnRevenue,
} from './useProductCalculations';
import { buildProductSavePayload } from './useProductFormDefaults';
import type { ProductFormData } from '../../schemas/product.schema';

export function useProductFormPage(productId?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(productId);

  const {
    product,
    uoms,
    categories,
    loadingInitial,
    loadError,
    refetchInitial,
  } = useProductFormDataQuery(productId);

  const {
    isSuccessOpen,
    successMessage,
    showSuccess,
    closeSuccess: storeCloseSuccess,
  } = useProductFormStore();

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

  const handleFormSave = useCallback(
    async (formData: ProductFormData) => {
      clearMutationError();
      try {
        const payload = buildProductSavePayload(formData);
        if (productId) {
          await updateProduct(productId, payload);
          showSuccess(`El producto "${formData.name}" ha sido actualizado con éxito.`);
        } else {
          await createProduct(payload);
          showSuccess(`El producto "${formData.name}" ha sido creado con éxito.`);
        }
      } catch {
        // Error state handled by useProductsMutations
      }
    },
    [productId, createProduct, updateProduct, clearMutationError, showSuccess]
  );

  const form = useProductForm({
    editingProduct: product,
    uoms,
    onSubmit: handleFormSave,
  });

  const costValue = Number(form.watch('lastCost')) || 0;
  const salePriceValue = Number(form.watch('lastSalePrice')) || 0;
  const grossProfit = calculateGrossProfit(salePriceValue, costValue);
  const profitMarginPercent =
    costValue > 0 ? ((grossProfit / costValue) * 100).toFixed(1) : '0.0';
  const marginOnRevenuePercent = calculateMarginOnRevenue(
    grossProfit,
    salePriceValue
  );

  const handleCancel = useCallback(() => {
    navigate('/catalog/products');
  }, [navigate]);

  const closeSuccessDialog = useCallback(() => {
    storeCloseSuccess();
    navigate('/catalog/products');
  }, [navigate, storeCloseSuccess]);

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
    selectedType: form.watch('type'),
    imageUrlValue: form.watch('imageUrl'),
    costValue,
    salePriceValue,
    productNameValue: form.watch('name'),

    // Financial calculations & Handlers
    grossProfit,
    profitMarginPercent,
    marginOnRevenuePercent,
    handleCostChange: form.handleCostChange,
    handleMarginChange: form.handleMarginChange,
    handleSalePriceChange: form.handleSalePriceChange,
    handleTypeSelect: form.handleTypeSelect,

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

export type UseProductFormPageReturn = ReturnType<typeof useProductFormPage>;
