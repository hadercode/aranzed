import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema, type RecipeFormData } from '../../schemas/recipe.schema';
import type { Recipe } from '../../types';
import type { Product } from '@/features/catalog/products/types';
import { useRecipeCostCalculations } from './useRecipeCostCalculations';
import { useRecipeFormItems } from './useRecipeFormItems';

export interface UseRecipeFormOptions {
  editingRecipe: Recipe | null;
  products: Product[];
  onSubmit: (data: RecipeFormData) => Promise<void>;
}

export function useRecipeForm({
  editingRecipe,
  products,
  onSubmit,
}: UseRecipeFormOptions) {
  const isEditing = Boolean(editingRecipe);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      code: '',
      name: '',
      productId: '',
      status: 'DRAFT',
      yieldQuantity: 1,
      description: '',
      syncProductCost: false,
      items: [],
    },
  });

  // Map products for fast O(1) lookup
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.id, p);
    }
    return map;
  }, [products]);

  // Delegated dynamic item list management
  const {
    itemFields,
    appendItem,
    removeItem,
    updateItem,
    handleComponentSelect,
    handleAddNewItem,
  } = useRecipeFormItems({
    control: form.control,
    setValue: form.setValue,
    productsMap,
  });

  // Reset form when editingRecipe changes
  useEffect(() => {
    if (editingRecipe) {
      form.reset({
        code: editingRecipe.code || '',
        name: editingRecipe.name,
        productId: editingRecipe.productId,
        status: editingRecipe.status,
        yieldQuantity: Number(editingRecipe.yieldQuantity) || 1,
        description: editingRecipe.description || '',
        syncProductCost: false,
        items: editingRecipe.items.map((i, idx) => ({
          id: i.id,
          productId: i.productId,
          quantity: Number(i.quantity) || 1,
          unitCost: Number(i.unitCost) || 0,
          notes: i.notes || '',
          sortOrder: i.sortOrder !== undefined ? i.sortOrder : idx,
        })),
      });
    } else {
      form.reset({
        code: '',
        name: '',
        productId: '',
        status: 'DRAFT',
        yieldQuantity: 1,
        description: '',
        syncProductCost: false,
        items: [],
      });
    }
  }, [editingRecipe, form]);

  // Reactive Watchers via useWatch for optimal React Compiler compatibility
  const watchedItems = useWatch({ control: form.control, name: 'items' }) || [];
  const watchedYield = Number(useWatch({ control: form.control, name: 'yieldQuantity' })) || 1;
  const watchedProductId = useWatch({ control: form.control, name: 'productId' });

  // Delegated domain cost calculation
  const { costBreakdown } = useRecipeCostCalculations({
    items: watchedItems,
    yieldQuantity: watchedYield,
    productsMap,
  });

  return {
    form,
    isEditing,
    itemFields,
    appendItem,
    removeItem,
    updateItem,
    handleComponentSelect,
    handleAddNewItem,
    costBreakdown,
    productsMap,
    watchedProductId,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}

export type UseRecipeFormReturn = ReturnType<typeof useRecipeForm>;
