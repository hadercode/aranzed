import { useMemo } from 'react';
import type { Category } from '../../types';

export function useEligibleParentCategories(
  categories: Category[],
  editingCategory: Category | null
) {
  return useMemo(() => {
    if (!editingCategory) {
      return categories.filter((c) => c.isActive);
    }

    const excludedIds = new Set<string>([editingCategory.id]);
    let added = true;
    while (added) {
      added = false;
      for (const cat of categories) {
        if (cat.parentId && excludedIds.has(cat.parentId) && !excludedIds.has(cat.id)) {
          excludedIds.add(cat.id);
          added = true;
        }
      }
    }

    return categories.filter((c) => !excludedIds.has(c.id) && c.isActive);
  }, [categories, editingCategory]);
}

