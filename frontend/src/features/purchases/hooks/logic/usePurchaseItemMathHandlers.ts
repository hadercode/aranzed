import { useCallback } from 'react';
import type { UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import type { PurchaseFormData } from '../../schemas/purchase.schema';

export interface UsePurchaseItemMathHandlersProps {
  setValue: UseFormSetValue<PurchaseFormData>;
  getValues: UseFormGetValues<PurchaseFormData>;
  exchangeRate: number;
  isDocLocal: boolean;
}

export function usePurchaseItemMathHandlers({
  setValue,
  getValues,
  exchangeRate,
  isDocLocal,
}: UsePurchaseItemMathHandlersProps) {
  const handleToggleTaxable = useCallback(
    (index: number, isTaxable: boolean) => {
      setValue(`items.${index}.isTaxable`, isTaxable, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.taxRate`, isTaxable ? 16.0 : 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const handleQuantityChange = useCallback(
    (index: number, newQty: number) => {
      setValue(`items.${index}.quantity`, newQty, { shouldValidate: true, shouldDirty: true });

      const lastEdited = getValues(`items.${index}.lastEditedField`);
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (lastEdited === 'subtotal') {
        const subtotal = Number(getValues(`items.${index}.subtotal`)) || 0;
        if (newQty > 0 && subtotal > 0) {
          const calcCost = Math.round((subtotal / newQty) * 10000) / 10000;
          setValue(`items.${index}.unitCost`, calcCost, { shouldValidate: true, shouldDirty: true });
          const costLocal = isDocLocal ? calcCost : Number((calcCost * rate).toFixed(4));
          setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });
        }
      } else {
        const unitCost = Number(getValues(`items.${index}.unitCost`)) || 0;
        const newSubtotal = Number((newQty * unitCost).toFixed(2));
        setValue(`items.${index}.subtotal`, newSubtotal, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  const handleUnitCostChange = useCallback(
    (index: number, newUnitCost: number) => {
      setValue(`items.${index}.unitCost`, newUnitCost, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.lastEditedField`, 'unitCost', { shouldDirty: true });

      const rate = exchangeRate > 0 ? exchangeRate : 1.0;
      const costLocal = isDocLocal ? newUnitCost : Number((newUnitCost * rate).toFixed(4));
      setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 0;
      const newSubtotal = Number((currentQty * newUnitCost).toFixed(2));
      setValue(`items.${index}.subtotal`, newSubtotal, { shouldValidate: true, shouldDirty: true });
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  const handleSubtotalChange = useCallback(
    (index: number, newSubtotal: number) => {
      setValue(`items.${index}.subtotal`, newSubtotal, { shouldValidate: true, shouldDirty: true });
      setValue(`items.${index}.lastEditedField`, 'subtotal', { shouldDirty: true });

      const currentQty = Number(getValues(`items.${index}.quantity`)) || 0;
      const rate = exchangeRate > 0 ? exchangeRate : 1.0;

      if (currentQty > 0) {
        const calcCost = Math.round((newSubtotal / currentQty) * 10000) / 10000;
        setValue(`items.${index}.unitCost`, calcCost, { shouldValidate: true, shouldDirty: true });
        const costLocal = isDocLocal ? calcCost : Number((calcCost * rate).toFixed(4));
        setValue(`items.${index}.unitCostLocal`, costLocal, { shouldDirty: true });
      }
    },
    [setValue, getValues, exchangeRate, isDocLocal]
  );

  return {
    handleToggleTaxable,
    handleQuantityChange,
    handleUnitCostChange,
    handleSubtotalChange,
  };
}

