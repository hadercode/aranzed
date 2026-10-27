import { useMemo } from 'react';
import {
  Boxes,
  RefreshCw,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react';
import type { DataTableColumn } from '@/shared/components/ui';
import { useRecipesContext } from '../../context';
import type { Recipe } from '../../types';
import { RecipeStatusBadge } from '../../components/table/RecipeStatusBadge';

export interface UseRecipesTableColumnsOptions {
  handleEdit?: (recipe: Recipe) => void;
  handleDeleteClick?: (recipe: Recipe) => void;
  handleSyncCostClick?: (recipe: Recipe) => void;
  isMutating?: boolean;
}

export function useRecipesTableColumns(options?: UseRecipesTableColumnsOptions) {
  const context = useRecipesContext();

  const handleEdit = options?.handleEdit ?? context.handleEdit;
  const handleDeleteClick = options?.handleDeleteClick ?? context.handleDeleteClick;
  const handleSyncCostClick = options?.handleSyncCostClick ?? context.handleSyncCostClick;
  const isMutating = options?.isMutating ?? context.isMutating;

  const columns: DataTableColumn<Recipe>[] = useMemo(
    () => [
      {
        key: 'code',
        title: 'Código',
        sortable: true,
        render: (recipe) => (
          <span className="font-mono font-medium text-xs px-2 py-0.5 rounded-md bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
            {recipe.code}
          </span>
        ),
      },
      {
        key: 'name',
        title: 'Receta / Fórmula',
        sortable: true,
        render: (recipe) => (
          <div>
            <div className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-sage-600)] dark:hover:text-[var(--color-sage-400)] transition-colors">
              {recipe.name}
            </div>
            {recipe.description && (
              <div className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
                {recipe.description}
              </div>
            )}
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
              <Boxes className="w-3 h-3 text-[var(--color-text-muted)]" />
              <span>{recipe.items?.length || 0} componentes / insumos</span>
            </div>
          </div>
        ),
      },
      {
        key: 'product',
        title: 'Producto Fabricado',
        sortable: true,
        render: (recipe) => (
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
        ),
      },
      {
        key: 'yieldQuantity',
        title: 'Rendimiento',
        sortable: true,
        render: (recipe) => (
          <span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {Number(recipe.yieldQuantity) || 1}
            </span>{' '}
            <span className="text-xs text-[var(--color-text-muted)]">
              {recipe.product?.uomCode || 'Und'}
            </span>
          </span>
        ),
      },
      {
        key: 'totalCost',
        title: 'Costo Total BOM',
        align: 'right',
        sortable: true,
        render: (recipe) => (
          <span className="font-medium text-[var(--color-text-primary)]">
            ${(Number(recipe.totalCost) || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: 'unitCost',
        title: 'Costo Unitario',
        align: 'right',
        sortable: true,
        render: (recipe) => {
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
        },
      },
      {
        key: 'status',
        title: 'Estado',
        align: 'center',
        sortable: true,
        render: (recipe) => <RecipeStatusBadge status={recipe.status} />,
      },
      {
        key: 'actions',
        title: 'Acciones',
        align: 'right',
        render: (recipe) => (
          <div className="flex items-center justify-end gap-1">
            {/* Sync Cost Action */}
            <button
              type="button"
              onClick={() => handleSyncCostClick(recipe)}
              disabled={isMutating}
              title="Sincronizar costo calculado con el producto terminado"
              className="p-1.5 text-[var(--color-text-muted)] hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Edit Action */}
            <button
              type="button"
              onClick={() => handleEdit(recipe)}
              title="Editar receta"
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-sage-600)] dark:hover:text-[var(--color-sage-400)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-sage-500)]/10 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete Action */}
            <button
              type="button"
              onClick={() => handleDeleteClick(recipe)}
              title="Eliminar receta"
              className="p-1.5 text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDeleteClick, handleSyncCostClick, isMutating]
  );

  return columns;
}

export default useRecipesTableColumns;
