import { useMemo } from 'react';
import type { Product, ProductStats } from '../../types';

export interface UseProductsStatsProps {
  products: Product[];
}

export function useProductsStats({ products }: UseProductsStatsProps) {
  const stats = useMemo<ProductStats>(() => {
    let traditional = 0;
    let rawMaterial = 0;
    let finishedGood = 0;
    let service = 0;
    let active = 0;
    let inactive = 0;

    for (const prod of products) {
      if (prod.isActive) {
        active++;
      } else {
        inactive++;
      }

      if (prod.type === 'TRADITIONAL') traditional++;
      else if (prod.type === 'RAW_MATERIAL') rawMaterial++;
      else if (prod.type === 'FINISHED_GOOD') finishedGood++;
      else if (prod.type === 'SERVICE') service++;
    }

    return {
      total: products.length,
      traditional,
      rawMaterial,
      finishedGood,
      service,
      active,
      inactive,
    };
  }, [products]);

  return { stats };
}

