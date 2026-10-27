import { useCallback } from 'react';
import {
  useFieldArray,
  type Control,
  type UseFormSetValue,
  type UseFormGetValues,
} from 'react-hook-form';
import type { PurchaseFormData } from '../../schemas/purchase.schema';
import type { Product } from '@/features/catalog/products/types';
import { useCurrencyStore } from '@/shared/hooks/store';

export interface UsePurchaseFormItemsProps {
  control: Control<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
  getValues: UseFormGetValues<PurchaseFormData>;
  materialsMap: Map<string, Product>;
  exchangeRate?: number;
  documentCurrency?: string;
  localCurrency?: string;
}

/**
 * Hook para la gestión dinámica de renglones de materiales en la compra (Header-Detail).
 * Maneja useFieldArray y el autocompletado reactivo de costos y nombres al seleccionar un material.
 */
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
  } = useFieldArray({
    control,
    name: 'items',
  });

  // Al seleccionar un material del catálogo: autocompletar descripción y último costo
  const handleMaterialSelect = useCallback(
    (index: number, selectedMaterialId: string) => {
      const selectedProduct = materialsMap.get(selectedMaterialId);
      const lastCostFunctional = selectedProduct ? Number(selectedProduct.lastCost) || 0 : 0;
      const materialName = selectedProduct ? selectedProduct.name : '';
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      // Si el comprobante está en la Moneda Local, el costo sugerido para el input se calcula a tasa
      const inputCost = isDocLocal
        ? Number((lastCostFunctional * rate).toFixed(2))
        : lastCostFunctional;

      setValue(`items.${index}.materialId`, selectedMaterialId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(`items.${index}.description`, materialName, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(`items.${index}.unitCost`, inputCost, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 1;
      setValue(`items.${index}.subtotal`, Number((currentQty * inputCost).toFixed(2)), {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(`items.${index}.lastEditedField`, 'unitCost', {
        shouldDirty: true,
      });

      const costLocal = isDocLocal
        ? inputCost
        : Number((inputCost * rate).toFixed(4));

      setValue(`items.${index}.unitCostLocal`, costLocal, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(`items.${index}.currencySymbolFunctional`, storeFunctionalSymbol, {
        shouldValidate: true,
      });

      setValue(`items.${index}.currencySymbolLocal`, storeLocalSymbol, {
        shouldValidate: true,
      });
    },
    [setValue, getValues, materialsMap, exchangeRate, isDocLocal, storeFunctionalSymbol, storeLocalSymbol]
  );

  // Alternar si el renglón es gravable de IVA (16%) o exento
  const handleToggleTaxable = useCallback(
    (index: number, isTaxable: boolean) => {
      setValue(`items.${index}.isTaxable`, isTaxable, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.taxRate`, isTaxable ? 16.0 : 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  // Manejo reactivo de Cantidad
  const handleQuantityChange = useCallback(
    (index: number, newQty: number) => {
      setValue(`items.${index}.quantity`, newQty, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const lastEdited = getValues(`items.${index}.lastEditedField`);
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (lastEdited === 'subtotal') {
        const subtotal = Number(getValues(`items.${index}.subtotal`)) || 0;
        if (newQty > 0 && subtotal > 0) {
          const calcCost = Math.round((subtotal / newQty) * 10000) / 10000;
          setValue(`items.${index}.unitCost`, calcCost, {
            shouldValidate: true,
            shouldDirty: true,
          });
          const costLocal = isDocLocal ? calcCost : Number((calcCost * rate).toFixed(4));
          setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });
        }
      } else {
        const unitCost = Number(getValues(`items.${index}.unitCost`)) || 0;
        const newSubtotal = Number((newQty * unitCost).toFixed(2));
        setValue(`items.${index}.subtotal`, newSubtotal, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  // Manejo reactivo de Costo Unitario
  const handleUnitCostChange = useCallback(
    (index: number, newUnitCost: number) => {
      setValue(`items.${index}.unitCost`, newUnitCost, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.lastEditedField`, 'unitCost', { shouldDirty: true });

      const rate = exchangeRate > 0 ? exchangeRate : 1.0;
      const costLocal = isDocLocal ? newUnitCost : Number((newUnitCost * rate).toFixed(4));
      setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 0;
      const newSubtotal = Number((currentQty * newUnitCost).toFixed(2));
      setValue(`items.${index}.subtotal`, newSubtotal, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  // Manejo reactivo de Subtotal
  const handleSubtotalChange = useCallback(
    (index: number, newSubtotal: number) => {
      setValue(`items.${index}.subtotal`, newSubtotal, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(`items.${index}.lastEditedField`, 'subtotal', { shouldDirty: true });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 0;
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (currentQty > 0) {
        const calcCost = Math.round((newSubtotal / currentQty) * 10000) / 10000;
        setValue(`items.${index}.unitCost`, calcCost, {
          shouldValidate: true,
          shouldDirty: true,
        });
        const costLocal = isDocLocal ? calcCost : Number((calcCost * rate).toFixed(4));
        setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });
      }
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  // Agregar un renglón en blanco por defecto
  const handleAddNewItem = useCallback(
    (defaultMaterialId?: string) => {
      let defaultCost = 0;
      let defaultName = '';
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (defaultMaterialId) {
        const p = materialsMap.get(defaultMaterialId);
        if (p) {
          const costFunctional = Number(p.lastCost) || 0;
          defaultCost = isDocLocal
            ? Number((costFunctional * rate).toFixed(2))
            : costFunctional;
          defaultName = p.name;
        }
      }

      const costLocal = isDocLocal
        ? defaultCost
        : Number((defaultCost * rate).toFixed(4));

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
    [
      appendItem,
      itemFields.length,
      materialsMap,
      exchangeRate,
      isDocLocal,
      storeFunctionalSymbol,
      storeLocalSymbol,
    ]
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
