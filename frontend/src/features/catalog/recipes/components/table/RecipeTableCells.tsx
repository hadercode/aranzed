import { Package } from 'lucide-react';
import type { Recipe } from '../../types';

export function RecipeProductCell({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] flex items-center justify-center shrink-0 border border-[var(--color-sage-500)]/20">
        <Package className="w-4 h-4" />
      </div>
      <div>
        <div className="font-medium text-[var(--color-text-primary)]">
          {recipe.product?.name || 'Producto Asociado'}
        </div>
        <div className="text-[11px] text-[var(--color-text-muted)]">
          UoM: {recipe.product?.uomCode || recipe.product?.uomName || 'UND'}
        </div>
      </div>
    </div>
  );
}

export function RecipeUnitCostCell({ recipe }: { recipe: Recipe }) {
  const yieldQty = Number(recipe.yieldQuantity) || 1;
  const totalCost = Number(recipe.totalCost) || 0;
  const unitCost = totalCost / yieldQty;

  return (
    <div>
      <span className="font-bold text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
        ${unitCost.toFixed(2)}
      </span>
      <div className="text-[10px] text-[var(--color-text-muted)]">
        por {recipe.product?.uomCode || 'unidad'}
      </div>
    </div>
  );
}

