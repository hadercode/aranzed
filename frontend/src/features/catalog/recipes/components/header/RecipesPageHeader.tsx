import { Plus, ScrollText } from 'lucide-react';
import { useRecipesContext } from '../../context';

export function RecipesPageHeader() {
  const { handleCreateNew } = useRecipesContext();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] border border-[var(--color-sage-500)]/20 shadow-xs">
          <ScrollText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Recetas / BOM (Listas de Materiales)
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gestión de fórmulas de fabricación, insumos de materia prima y costos de mano de obra
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-sage-500)] text-white font-medium shadow-xs hover:bg-[var(--color-sage-600)] transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Receta</span>
        </button>
      </div>
    </div>
  );
}
