import { useMemo } from 'react';
import type { Recipe, RecipeStats } from '../../types';

/**
 * Sub-hook for reactive derivation of KPI statistics from the recipe collection.
 * Isolates aggregation logic to avoid recalculations across unrelated UI updates.
 */
export function useRecipeStats(recipes: Recipe[]): { stats: RecipeStats } {
  const stats: RecipeStats = useMemo(() => {
    const total = recipes.length;
    let active = 0;
    let draft = 0;
    let inactive = 0;
    let costSum = 0;

    for (const r of recipes) {
      if (r.status === 'ACTIVE') active++;
      else if (r.status === 'DRAFT') draft++;
      else if (r.status === 'INACTIVE') inactive++;

      costSum += Number(r.totalCost) || 0;
    }

    const avgCost = total > 0 ? costSum / total : 0;

    return {
      total,
      active,
      draft,
      inactive,
      avgCost: Number(avgCost.toFixed(2)),
    };
  }, [recipes]);

  return { stats };
}

export type UseRecipeStatsReturn = ReturnType<typeof useRecipeStats>;
