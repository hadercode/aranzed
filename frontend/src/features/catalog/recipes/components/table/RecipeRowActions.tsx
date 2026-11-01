import { RefreshCw, Pencil, Trash2 } from 'lucide-react';
import type { Recipe } from '../../types';

export interface RecipeRowActionsProps {
  recipe: Recipe;
  onSyncCost: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  isMutating?: boolean;
}

export function RecipeRowActions({
  recipe,
  onSyncCost,
  onEdit,
  onDelete,
  isMutating,
}: RecipeRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onSyncCost(recipe)}
        disabled={isMutating}
        title="Sincronizar costo calculado con el producto terminado"
        className="p-1.5 text-[var(--color-text-muted)] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onEdit(recipe)}
        title="Editar receta"
        className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-sage-600)] dark:hover:text-[var(--color-sage-400)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-sage-500)]/10 rounded-lg transition-colors cursor-pointer"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(recipe)}
        title="Eliminar receta"
        className="p-1.5 text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

