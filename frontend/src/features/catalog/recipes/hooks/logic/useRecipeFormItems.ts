import { useCallback } from 'react';
import { useFieldArray, type Control, type UseFormSetValue } from 'react-hook-form';
import type { RecipeFormData } from '../../schemas/recipe.schema';
import type { Product } from '@/features/catalog/products/types';

export interface UseRecipeFormItemsProps {
  control: Control<RecipeFormData>;
  setValue: UseFormSetValue<RecipeFormData>;
  productsMap: Map<string, Product>;
}

/**
 * Sub-hook for managing recipe detail items (dynamic array rows).
 * Encapsulates useFieldArray operations and component selection side-effects.
 */
export function useRecipeFormItems({
  control,
  setValue,
  productsMap,
}: UseRecipeFormItemsProps) {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
    update: updateItem,
  } = useFieldArray({
    control,
    name: 'items',
  });

  // When a component product is selected in a row, auto-fill its unitCost with lastCost
  const handleComponentSelect = useCallback(
    (index: number, selectedProductId: string) => {
      const selectedProduct = productsMap.get(selectedProductId);
      const lastCost = selectedProduct ? Number(selectedProduct.lastCost) || 0 : 0;

      setValue(`items.${index}.productId`, selectedProductId, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.unitCost`, lastCost, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, productsMap]
  );

  // Add default blank item row
  const handleAddNewItem = useCallback(
    (defaultProductId?: string) => {
      let defaultCost = 0;
      if (defaultProductId) {
        const p = productsMap.get(defaultProductId);
        if (p) defaultCost = Number(p.lastCost) || 0;
      }
      appendItem({
        productId: defaultProductId || '',
        quantity: 1,
        unitCost: defaultCost,
        notes: '',
        sortOrder: itemFields.length,
      });
    },
    [appendItem, itemFields.length, productsMap]
  );

  return {
    itemFields,
    appendItem,
    removeItem,
    updateItem,
    handleComponentSelect,
    handleAddNewItem,
  };
}

export type UseRecipeFormItemsReturn = ReturnType<typeof useRecipeFormItems>;
