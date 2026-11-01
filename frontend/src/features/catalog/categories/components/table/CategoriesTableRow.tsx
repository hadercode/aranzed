import { Folder, CornerDownRight, Edit2, Trash2 } from 'lucide-react';
import type { Category } from '../../types';

interface CategoriesTableRowProps {
  category: Category;
  parentName?: string;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoriesTableRow({
  category,
  parentName,
  onEdit,
  onDelete,
}: CategoriesTableRowProps) {
  const isSubcategory = Boolean(category.parentId);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <tr className="hover:bg-[var(--color-surface-hover)]/40 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {isSubcategory ? (
            <div className="flex items-center gap-2 pl-4 text-[var(--color-text-muted)]">
              <CornerDownRight className="w-4 h-4 text-[var(--color-sage-500)] shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-[var(--color-sage-50)] text-[var(--color-sage-600)] flex items-center justify-center shrink-0">
                <Folder className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[var(--color-surface-card)] text-[var(--color-sage-600)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              <Folder className="w-4 h-4" />
            </div>
          )}

          <div>
            <span className="font-semibold text-sm text-[var(--color-text-primary)] block">
              {category.name}
            </span>
            {isSubcategory && parentName && (
              <span className="text-[11px] text-[var(--color-text-muted)] block">
                Subcategoría de: <strong className="font-medium text-[var(--color-text-secondary)]">{parentName}</strong>
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-xs font-medium text-[var(--color-text-secondary)]">
        {parentName ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
            {parentName}
          </span>
        ) : (
          <span className="text-[var(--color-text-muted)] italic">Categoría Principal</span>
        )}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            category.isActive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          {category.isActive ? 'Activa' : 'Inactiva'}
        </span>
      </td>

      <td className="px-6 py-4 text-xs text-[var(--color-text-secondary)] font-mono">
        {formatDate(category.createdAt)}
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
            title="Editar categoría"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
            title="Eliminar categoría"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

