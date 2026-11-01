import { useCallback } from 'react';
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import type { ProductFormData } from '../../schemas/product.schema';

export function calculateSalePrice(cost: number, marginPercent: number): number {
  if (cost <= 0) return 0;
  return Number((cost * (1 + marginPercent / 100)).toFixed(2));
}

export function calculateProfitMargin(cost: number, salePrice: number): number {
  if (cost <= 0) return 0;
  const margin = Number((((salePrice - cost) / cost) * 100).toFixed(2));
  return margin >= 0 ? margin : 0;
}

export function calculateGrossProfit(salePrice: number, cost: number): number {
  return Math.max(0, Number((salePrice - cost).toFixed(2)));
}

export function calculateMarginOnRevenue(grossProfit: number, salePrice: number): string {
  if (salePrice <= 0) return '0.0';
  return ((grossProfit / salePrice) * 100).toFixed(1);
}

interface UseProductCalculationsProps {
  getValues: UseFormGetValues<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export function useProductCalculations({
  getValues,
  setValue,
}: UseProductCalculationsProps) {
  const handleCostChange = useCallback(
    (newCost: number) => {
      const margin = Number(getValues('profitMargin')) || 0;
      setValue('lastCost', newCost, { shouldValidate: true, shouldDirty: true });
      const salePrice = calculateSalePrice(newCost, margin);
      setValue('lastSalePrice', salePrice, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleMarginChange = useCallback(
    (newMargin: number) => {
      const cost = Number(getValues('lastCost')) || 0;
      setValue('profitMargin', newMargin, { shouldValidate: true, shouldDirty: true });
      const salePrice = calculateSalePrice(cost, newMargin);
      setValue('lastSalePrice', salePrice, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleSalePriceChange = useCallback(
    (newSalePrice: number) => {
      const cost = Number(getValues('lastCost')) || 0;
      setValue('lastSalePrice', newSalePrice, { shouldValidate: true, shouldDirty: true });
      if (cost > 0) {
        const margin = calculateProfitMargin(cost, newSalePrice);
        setValue('profitMargin', margin, { shouldValidate: true, shouldDirty: true });
      }
    },
    [getValues, setValue]
  );

  return {
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
  };
}

