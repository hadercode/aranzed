import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../../schemas/product.schema';
import type { Product } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';

interface UseProductFormOptions {
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
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      type: 'TRADITIONAL',
      uomId: '',
      categoryId: '',
      profitMargin: 30,
      lastCost: 0,
      lastSalePrice: 0,
      isActive: true,
      manageInventory: true,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        type: editingProduct.type,
        uomId: editingProduct.uomId,
        categoryId: editingProduct.categoryId || '',
        profitMargin: Number(editingProduct.profitMargin) || 0,
        lastCost: Number(editingProduct.lastCost) || 0,
        lastSalePrice: Number(editingProduct.lastSalePrice) || 0,
        isActive: editingProduct.isActive,
        manageInventory:
          editingProduct.manageInventory !== undefined
            ? editingProduct.manageInventory
            : editingProduct.type !== 'SERVICE',
      });
    } else {
      reset({
        name: '',
        description: '',
        imageUrl: '',
        type: 'TRADITIONAL',
        uomId: uoms.length > 0 ? uoms[0].id : '',
        categoryId: '',
        profitMargin: 30,
        lastCost: 0,
        lastSalePrice: 0,
        isActive: true,
        manageInventory: true,
      });
    }
  }, [editingProduct, uoms, reset]);

  const handleCostChange = useCallback(
    (newCost: number) => {
      const margin = Number(getValues('profitMargin')) || 0;
      setValue('lastCost', newCost, { shouldValidate: true, shouldDirty: true });
      const salePrice = Number((newCost * (1 + margin / 100)).toFixed(2));
      setValue('lastSalePrice', salePrice, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleMarginChange = useCallback(
    (newMargin: number) => {
      const cost = Number(getValues('lastCost')) || 0;
      setValue('profitMargin', newMargin, { shouldValidate: true, shouldDirty: true });
      const salePrice = Number((cost * (1 + newMargin / 100)).toFixed(2));
      setValue('lastSalePrice', salePrice, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleSalePriceChange = useCallback(
    (newSalePrice: number) => {
      const cost = Number(getValues('lastCost')) || 0;
      setValue('lastSalePrice', newSalePrice, { shouldValidate: true, shouldDirty: true });
      if (cost > 0) {
        const calculatedMargin = Number((((newSalePrice - cost) / cost) * 100).toFixed(2));
        setValue('profitMargin', calculatedMargin >= 0 ? calculatedMargin : 0, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [getValues, setValue]
  );

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
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
  };
}
