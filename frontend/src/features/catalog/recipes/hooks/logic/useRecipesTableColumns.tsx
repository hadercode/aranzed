import { useMemo } from 'react';
import { Boxes } from 'lucide-react';
import type { DataTableColumn } from '@/shared/components/ui';
import { useRecipesPage } from './useRecipesPage';
import type { Recipe } from '../../types';
import { RecipeStatusBadge } from '../../components/table/RecipeStatusBadge';
import { RecipeRowActions } from '../../components/table/RecipeRowActions';
import { RecipeProductCell, RecipeUnitCostCell } from '../../components/table/RecipeTableCells';

export interface UseRecipesTableColumnsOptions {
  handleEdit?: (recipe: Recipe) => void;
  handleDeleteClick?: (recipe: Recipe) => void;
  handleSyncCostClick?: (recipe: Recipe) => void;
  isMutating?: boolean;
}

export function useRecipesTableColumns(options?: UseRecipesTableColumnsOptions) {
  const page = useRecipesPage();

  const handleEdit = options?.handleEdit ?? page.handleEdit;
  const handleDeleteClick = options?.handleDeleteClick ?? page.handleDeleteClick;
  const handleSyncCostClick = options?.handleSyncCostClick ?? page.handleSyncCostClick;
  const isMutating = options?.isMutating ?? page.isMutating;

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
        render: (recipe) => <RecipeProductCell recipe={recipe} />,
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
        render: (recipe) => <RecipeUnitCostCell recipe={recipe} />,
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
          <RecipeRowActions
            recipe={recipe}
            onSyncCost={handleSyncCostClick}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isMutating={isMutating}
          />
        ),
      },
    ],
    [handleEdit, handleDeleteClick, handleSyncCostClick, isMutating]
  );

  return columns;
}

export default useRecipesTableColumns;
