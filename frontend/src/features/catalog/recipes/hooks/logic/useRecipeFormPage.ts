import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeFormDataQuery } from '../queries/useRecipeFormDataQuery';
import { useRecipesMutations } from '../mutations/useRecipesMutations';
import { useRecipeForm } from './useRecipeForm';
import type { RecipeFormData } from '../../schemas/recipe.schema';

export function useRecipeFormPage(recipeId?: string) {
  const navigate = useNavigate();

  // 1. Initial form data loading
  const {
    recipe,
    products,
    loadingInitial,
    loadError,
    refetchInitial,
  } = useRecipeFormDataQuery(recipeId);

  // 2. Feedback dialog states
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 3. API Mutations
  const {
    createRecipe,
    updateRecipe,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useRecipesMutations();

  // 4. Form Submission Handler
  const handleFormSave = useCallback(
    async (formData: RecipeFormData) => {
      clearMutationError();

      try {
        const payload = {
          code: formData.code?.trim() || undefined,
          name: formData.name.trim(),
          productId: formData.productId,
          status: formData.status,
          yieldQuantity: Number(formData.yieldQuantity) || 1,
          description: formData.description?.trim() || undefined,
          syncProductCost: formData.syncProductCost ?? false,
          items: formData.items.map((item, index) => ({
            productId: item.productId,
            quantity: Number(item.quantity) || 1,
            unitCost: Number(item.unitCost) || 0,
            notes: item.notes?.trim() || undefined,
            sortOrder: index,
          })),
        };

        if (recipeId) {
          await updateRecipe(recipeId, payload);
          setSuccessMessage(
            `La receta "${formData.name}" ha sido actualizada con éxito.`
          );
        } else {
          await createRecipe(payload);
          setSuccessMessage(
            `La receta "${formData.name}" ha sido creada con éxito.`
          );
        }

        setIsSuccessOpen(true);
      } catch {
        // Error state handled by useRecipesMutations
      }
    },
    [recipeId, createRecipe, updateRecipe, clearMutationError]
  );

  // 5. Form Logic via React Hook Form & Zod
  const formManager = useRecipeForm({
    editingRecipe: recipe,
    products,
    onSubmit: handleFormSave,
  });

  // 6. Partition Products for Selectors
  // Parent product can be FINISHED_GOOD or TRADITIONAL
  const parentProductOptions = useMemo(() => {
    return products.filter(
      (p) => p.type === 'FINISHED_GOOD' || p.type === 'TRADITIONAL'
    );
  }, [products]);

  // Selected parent product info
  const selectedParentProduct = useMemo(() => {
    if (!formManager.watchedProductId) return null;
    return formManager.productsMap.get(formManager.watchedProductId) || null;
  }, [formManager.watchedProductId, formManager.productsMap]);

  // Component products (Raw materials, services, and other products except the current parent product)
  const componentProductOptions = useMemo(() => {
    return products.filter((p) => p.id !== formManager.watchedProductId);
  }, [products, formManager.watchedProductId]);

  // 7. Navigation & Helpers
  const handleCancel = useCallback(() => {
    navigate('/catalog/recipes');
  }, [navigate]);

  const handleSuccessClose = useCallback(() => {
    setIsSuccessOpen(false);
    navigate('/catalog/recipes');
  }, [navigate]);

  return {
    recipeId,
    loadingInitial,
    loadError,
    refetchInitial,

    // Form Manager
    ...formManager,

    // Options
    products,
    parentProductOptions,
    selectedParentProduct,
    componentProductOptions,

    // Mutation & Feedback state
    isMutating,
    mutationError,
    clearMutationError,
    isSuccessOpen,
    successMessage,
    handleSave: formManager.handleSubmit,
    handleCancel,
    handleSuccessClose,
  };
}

export type UseRecipeFormPageReturn = ReturnType<typeof useRecipeFormPage>;
