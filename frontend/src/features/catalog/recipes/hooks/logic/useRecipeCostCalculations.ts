import { useMemo } from 'react';
import type { Product } from '@/features/catalog/products/types';

export interface RecipeCostBreakdown {
  materialsCost: number;
  laborCost: number;
  totalCost: number;
  unitCost: number;
}

export interface UseRecipeCostCalculationsProps {
  items: Array<{ productId: string; quantity: number; unitCost: number }>;
  yieldQuantity: number;
  productsMap: Map<string, Product>;
}

/**
 * Isolated domain calculation hook for BOM recipes.
 * Decoupled from React Hook Form lifecycle for pure arithmetic testability.
 */
export function useRecipeCostCalculations({
  items,
  yieldQuantity,
  productsMap,
}: UseRecipeCostCalculationsProps): { costBreakdown: RecipeCostBreakdown } {
  const costBreakdown = useMemo<RecipeCostBreakdown>(() => {
    let materialsCost = 0;
    let laborCost = 0;

    for (const row of items) {
      const qty = Number(row.quantity) || 0;
      const unit = Number(row.unitCost) || 0;
      const lineSubtotal = qty * unit;

      const compProduct = productsMap.get(row.productId);
      if (compProduct?.type === 'SERVICE') {
        laborCost += lineSubtotal;
      } else {
        materialsCost += lineSubtotal;
      }
    }

    const totalCost = materialsCost + laborCost;
    const yieldQty = yieldQuantity > 0 ? yieldQuantity : 1;
    const unitCost = totalCost / yieldQty;

    return {
      materialsCost: Number(materialsCost.toFixed(4)),
      laborCost: Number(laborCost.toFixed(4)),
      totalCost: Number(totalCost.toFixed(4)),
      unitCost: Number(unitCost.toFixed(4)),
    };
  }, [items, yieldQuantity, productsMap]);

  return { costBreakdown };
}
