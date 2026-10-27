import { useMemo } from 'react';
import type { Category, CategoryStats } from '../../types';

export interface UseCategoriesStatsProps {
  categories: Category[];
}

export function useCategoriesStats({ categories }: UseCategoriesStatsProps) {
  const stats = useMemo<CategoryStats>(() => {
    let active = 0;
    let inactive = 0;
    let rootCategories = 0;
    let subcategories = 0;

    for (const cat of categories) {
      if (cat.isActive) {
        active++;
      } else {
        inactive++;
      }

      if (!cat.parentId) {
        rootCategories++;
      } else {
        subcategories++;
      }
    }

    return {
      total: categories.length,
      active,
      inactive,
      rootCategories,
      subcategories,
    };
  }, [categories]);

  return { stats };
}
