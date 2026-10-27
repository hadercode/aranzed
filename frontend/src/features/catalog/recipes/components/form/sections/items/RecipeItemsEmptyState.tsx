import { Boxes } from 'lucide-react';
import { useRecipeFormContext } from '../../../../context';

export function RecipeItemsEmptyState() {
  const { handleAddNewItem } = useRecipeFormContext();

  return (
    <div className="p-8 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-center flex flex-col items-center justify-center space-y-3 bg-[var(--color-surface-bg)]">
      <div className="p-3 rounded-2xl bg-[var(--color-surface-card)] text-[var(--color-text-muted)] shadow-xs">
        <Boxes className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          No hay componentes en esta receta
        </p>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm">
          Agrega las materias primas necesarias y los servicios de mano de obra para calcular el costo de producción.
        </p>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleAddNewItem()}
          className="px-3.5 py-2 rounded-xl bg-[var(--color-sage-500)] text-white text-xs font-medium hover:bg-[var(--color-sage-600)] transition-all shadow-xs cursor-pointer"
        >
          + Agregar Primer Insumo
        </button>
      </div>
    </div>
  );
}
