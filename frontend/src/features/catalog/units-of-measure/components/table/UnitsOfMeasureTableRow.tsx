import { Edit2, Trash2 } from 'lucide-react';
import type { UnitOfMeasure } from '../../types';

interface UnitsOfMeasureTableRowProps {
  uom: UnitOfMeasure;
  onEdit: (uom: UnitOfMeasure) => void;
  onDelete: (uom: UnitOfMeasure) => void;
}

export function UnitsOfMeasureTableRow({
  uom,
  onEdit,
  onDelete,
}: UnitsOfMeasureTableRowProps) {
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
        <span className="font-mono font-bold text-sm text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] px-2.5 py-1 rounded-lg bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 border border-[var(--color-sage-500)]/20">
          {uom.code}
        </span>
      </td>

      <td className="px-6 py-4 font-medium text-sm text-[var(--color-text-primary)]">
        {uom.name}
      </td>

      <td className="px-6 py-4 text-xs font-mono font-semibold text-[var(--color-text-secondary)]">
        {uom.code}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            uom.allowDecimals
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          }`}
        >
          {uom.allowDecimals ? 'Decimales (0.00)' : 'Solo Enteros'}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            uom.isActive
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          {uom.isActive ? 'Activa' : 'Inactiva'}
        </span>
      </td>

      <td className="px-6 py-4 text-xs text-[var(--color-text-secondary)] font-mono">
        {formatDate(uom.createdAt)}
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(uom)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
            title="Editar unidad"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(uom)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
            title="Eliminar unidad"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
