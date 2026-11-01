import { useCallback } from 'react';
import { useFieldArray, type Control, type UseFormSetValue, type UseFormGetValues } from 'react-hook-form';
import type { PurchaseFormData } from '../../schemas/purchase.schema';
import type { Product } from '@/features/catalog/products/types';
import { useCurrencyStore } from '@/shared/hooks/store';
import { usePurchaseItemMathHandlers } from './usePurchaseItemMathHandlers';

export interface UsePurchaseFormItemsProps {
  control: Control<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
  getValues: UseFormGetValues<PurchaseFormData>;
  materialsMap: Map<string, Product>;
  exchangeRate?: number;
  documentCurrency?: string;
  localCurrency?: string;
}

export function usePurchaseFormItems({
  control,
  setValue,
  getValues,
  materialsMap,
  exchangeRate = 1.0,
  documentCurrency,
  localCurrency,
}: UsePurchaseFormItemsProps) {
  const {
    functionalCurrency: storeFunctionalCurrency,
    functionalSymbol: storeFunctionalSymbol,
    localCurrency: storeLocalCurrency,
    localSymbol: storeLocalSymbol,
  } = useCurrencyStore();

  const resolvedLocal = localCurrency || storeLocalCurrency;
  const resolvedDocCurrency = documentCurrency || storeFunctionalCurrency;
  const isDocLocal = resolvedDocCurrency === resolvedLocal;

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
    update: updateItem,
  } = useFieldArray({ control, name: 'items' });

  const {
    handleToggleTaxable,
    handleQuantityChange,
    handleUnitCostChange,
    handleSubtotalChange,
  } = usePurchaseItemMathHandlers({
    setValue,
    getValues,
    exchangeRate,
    isDocLocal,
  });

  const handleMaterialSelect = useCallback(
    (index: number, selectedMaterialId: string) => {
      const selectedProduct = materialsMap.get(selectedMaterialId);
      const lastCostFunctional = selectedProduct ? Number(selectedProduct.lastCost) || 0 : 0;
      const materialName = selectedProduct ? selectedProduct.name : '';
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      const inputCost = isDocLocal
        ? Number((lastCostFunctional * rate).toFixed(2))
        : lastCostFunctional;

      setValue(`items.${index}.materialId`, selectedMaterialId, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.description`, materialName, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.unitCost`, inputCost, { shouldValidate: true, shouldDirty: true });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 1;
      setValue(`items.${index}.subtotal`, Number((currentQty * inputCost).toFixed(2)), {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(`items.${index}.lastEditedField`, 'unitCost', { shouldDirty: true });

      const costLocal = isDocLocal ? inputCost : Number((inputCost * rate).toFixed(4));
      setValue(`items.${index}.unitCostLocal`, costLocal, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.currencySymbolFunctional`, storeFunctionalSymbol, { shouldValidate: true });
      setValue(`items.${index}.currencySymbolLocal`, storeLocalSymbol, { shouldValidate: true });
    },
    [setValue, getValues, materialsMap, exchangeRate, isDocLocal, storeFunctionalSymbol, storeLocalSymbol]
  );

  const handleAddNewItem = useCallback(
    (defaultMaterialId?: string) => {
      let defaultCost = 0;
      let defaultName = '';
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (defaultMaterialId) {
        const p = materialsMap.get(defaultMaterialId);
        if (p) {
          const costFunctional = Number(p.lastCost) || 0;
          defaultCost = isDocLocal ? Number((costFunctional * rate).toFixed(2)) : costFunctional;
          defaultName = p.name;
        }
      }

      const costLocal = isDocLocal ? defaultCost : Number((defaultCost * rate).toFixed(4));

      appendItem({
        materialId: defaultMaterialId || '',
        description: defaultName || '',
        quantity: 1,
        unitCost: defaultCost,
        unitCostLocal: costLocal,
        subtotal: Number((1 * defaultCost).toFixed(2)),
        lastEditedField: 'unitCost',
        currencySymbolFunctional: storeFunctionalSymbol,
        currencySymbolLocal: storeLocalSymbol,
        isTaxable: true,
        taxRate: 16.0,
        sortOrder: itemFields.length,
      });
    },
    [appendItem, itemFields.length, materialsMap, exchangeRate, isDocLocal, storeFunctionalSymbol, storeLocalSymbol]
  );

  return {
    itemFields,
    appendItem,
    removeItem,
    updateItem,
    handleMaterialSelect,
    handleToggleTaxable,
    handleQuantityChange,
    handleUnitCostChange,
    handleSubtotalChange,
    handleAddNewItem,
  };
}

export type UsePurchaseFormItemsReturn = ReturnType<typeof usePurchaseFormItems>;
