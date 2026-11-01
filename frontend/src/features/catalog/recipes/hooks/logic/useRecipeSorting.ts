import { useState, useMemo, useCallback } from 'react';
import type { Recipe } from '../../types';

export function useRecipeSorting(recipes: Recipe[]) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const handleSortChange = useCallback((field: string, order: 'asc' | 'desc' | null) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const sortedRecipes = useMemo(() => {
    if (!sortBy || !sortOrder) return recipes;

    return [...recipes].sort((a, b) => {
      let valA: unknown;
      let valB: unknown;

      switch (sortBy) {
        case 'code':
          valA = a.code?.toLowerCase() || '';
          valB = b.code?.toLowerCase() || '';
          break;
        case 'name':
          valA = a.name?.toLowerCase() || '';
          valB = b.name?.toLowerCase() || '';
          break;
        case 'product':
          valA = a.product?.name?.toLowerCase() || '';
          valB = b.product?.name?.toLowerCase() || '';
          break;
        case 'yieldQuantity':
          valA = Number(a.yieldQuantity) || 0;
          valB = Number(b.yieldQuantity) || 0;
          break;
        case 'totalCost':
          valA = Number(a.totalCost) || 0;
          valB = Number(b.totalCost) || 0;
          break;
        case 'unitCost':
          valA = (Number(a.totalCost) || 0) / (Number(a.yieldQuantity) || 1);
          valB = (Number(b.totalCost) || 0) / (Number(b.yieldQuantity) || 1);
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          break;
        default:
          valA = (a as unknown as Record<string, unknown>)[sortBy];
          valB = (b as unknown as Record<string, unknown>)[sortBy];
      }

      if ((valA as string | number) < (valB as string | number)) return sortOrder === 'asc' ? -1 : 1;
      if ((valA as string | number) > (valB as string | number)) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recipes, sortBy, sortOrder]);

  return {
    sortBy,
    sortOrder,
    handleSortChange,
    sortedRecipes,
  };
}

