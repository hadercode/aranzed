import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseFormDataQuery } from '../queries/usePurchaseFormDataQuery';
import { usePurchasesMutations } from '../mutations/usePurchasesMutations';
import { usePurchaseForm } from './usePurchaseForm';
import type { PurchaseFormData } from '../../schemas/purchase.schema';
import { useCurrencyStore, useFeedbackStore } from '@/shared/hooks/store';
import { toPurchasePayload } from '../../services';

export function usePurchaseFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const {
    functionalCurrency: storeFunctionalCurrency,
    functionalSymbol: storeFunctionalSymbol,
    localCurrency: storeLocalCurrency,
    localSymbol: storeLocalSymbol,
  } = useCurrencyStore();

  // 1. Data Query
  const {
    purchase,
    rawMaterials,
    loadingInitial,
    loadError,
    refetchInitial,
  } = usePurchaseFormDataQuery(id);

  // 2. Mutations
  const {
    createPurchase,
    updatePurchase,
    isMutating,
    error: mutationError,
    clearError,
  } = usePurchasesMutations();

  // 3. Form setup & reactive calculations
  const { form, formItems, breakdown, materialsMap } = usePurchaseForm({
    initialPurchase: purchase,
    rawMaterials,
  });

  // 4. Submit Handler
  const handleSave = form.handleSubmit(async (data: PurchaseFormData) => {
    clearError();
    try {
      const payload = toPurchasePayload(data, {
        storeFunctionalCurrency,
        storeLocalCurrency,
        storeFunctionalSymbol,
        storeLocalSymbol,
      });

      const result =
        isEditMode && id
          ? await updatePurchase(id, payload)
          : await createPurchase(payload);

      const message = `Compra #${result.purchaseNumber} ${
        isEditMode ? 'actualizada' : 'registrada'
      } exitosamente${
        result.status === 'COMPLETED' ? ' y evento de stock emitido.' : '.'
      }`;

      useFeedbackStore.getState().showSuccess(message);
      navigate('/purchases');
    } catch (err: unknown) {
      useFeedbackStore.getState().showError(err);
    }
  });

  const handleCancel = useCallback(() => {
    navigate('/purchases');
  }, [navigate]);

  return {
    isEditMode,
    loadingInitial,
    loadError,
    refetchInitial,
    form,
    formItems,
    breakdown,
    rawMaterials,
    materialsMap,
    isMutating,
    mutationError,
    clearError,
    handleSave,
    handleCancel,
  };
}

export type UsePurchaseFormPageReturn = ReturnType<typeof usePurchaseFormPage>;
