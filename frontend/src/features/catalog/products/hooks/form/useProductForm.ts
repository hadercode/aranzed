import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../../schemas/product.schema';
import type { Product, ProductType } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import {
  getDefaultFlagsForType,
  buildInitialProductFormData,
} from './useProductFormDefaults';
import { useProductCalculations } from './useProductCalculations';

export interface UseProductFormOptions {
  editingProduct: Product | null;
  uoms: UnitOfMeasure[];
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export function useProductForm({
  editingProduct,
  uoms,
  onSubmit,
}: UseProductFormOptions) {
  const isEditing = Boolean(editingProduct);

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: buildInitialProductFormData(editingProduct, uoms),
  });

  // Sincronizar formulario al cambiar producto o catálogo de unidades
  useEffect(() => {
    reset(buildInitialProductFormData(editingProduct, uoms));
  }, [editingProduct, uoms, reset]);

  // Selección interactiva de tipo con defaults automáticos
  const handleTypeSelect = useCallback(
    (newType: ProductType) => {
      setValue('type', newType, { shouldValidate: true, shouldDirty: true });
      if (!isEditing) {
        const defaults = getDefaultFlagsForType(newType);
        setValue('isForSale', defaults.isForSale, { shouldDirty: true });
        setValue('isForInternalUse', defaults.isForInternalUse, { shouldDirty: true });
        setValue('manageInventory', defaults.manageInventory, { shouldDirty: true });
      }
    },
    [setValue, isEditing]
  );

  // Cálculos financieros reactivos
  const {
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
  } = useProductCalculations({ getValues, setValue });

  return {
    register,
    handleSubmit: handleFormSubmit(onSubmit),
    errors,
    isSubmitting,
    isDirty,
    isEditing,
    setValue,
    watch,
    getValues,
    reset,
    handleTypeSelect,
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
  };
}

