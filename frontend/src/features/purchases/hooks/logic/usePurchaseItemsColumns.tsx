import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { PurchaseFormData } from '../../schemas/purchase.schema';
import type { usePurchaseFormItems } from './usePurchaseFormItems';
import type { Product } from '@/features/catalog/products/types';
import type { Column } from '@/shared/components/ui';
import { useCurrencyStore } from '@/shared/hooks/store';
import { buildPurchaseItemsColumns } from './purchaseItemsColumnsBuilder';

export interface UsePurchaseItemsColumnsOptions {
  form: UseFormReturn<PurchaseFormData>;
  formItems: ReturnType<typeof usePurchaseFormItems>;
  rawMaterials: Product[];
}

export function usePurchaseItemsColumns({
  form,
  formItems,
  rawMaterials,
}: UsePurchaseItemsColumnsOptions) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const { register, control, watch, formState: { errors } } = form;

  const {
    itemFields,
    removeItem,
    handleMaterialSelect,
    handleToggleTaxable,
    handleQuantityChange,
    handleUnitCostChange,
    handleSubtotalChange,
  } = formItems;

  const watchedDoc = watch('documentCurrency') || functionalCurrency;
  const watchedLocal = watch('localCurrency') || localCurrency;
  const isDocLocal = watchedDoc === watchedLocal;

  const columns: Column<(typeof itemFields)[number]>[] = useMemo(
    () =>
      buildPurchaseItemsColumns({
        itemFields,
        register,
        control,
        errors,
        rawMaterials,
        functionalSymbol,
        localSymbol,
        isDocLocal,
        handleMaterialSelect,
        handleQuantityChange,
        handleUnitCostChange,
        handleSubtotalChange,
        handleToggleTaxable,
        removeItem,
      }),
    [
      itemFields,
      errors,
      register,
      control,
      handleMaterialSelect,
      handleToggleTaxable,
      handleQuantityChange,
      handleUnitCostChange,
      handleSubtotalChange,
      rawMaterials,
      removeItem,
      isDocLocal,
      functionalSymbol,
      localSymbol,
    ]
  );

  return { columns, itemFields };
}
