import { Edit2, Trash2 } from 'lucide-react';
import type { InventoryReason, InventoryReasonType } from '../types';

interface ReasonTableProps {
  reasons: InventoryReason[];
  isLoading: boolean;
  onEdit: (reason: InventoryReason) => void;
  onDelete: (id: string) => void;
}

export function ReasonTable({
  reasons,
  isLoading,
  onEdit,
  onDelete,
}: ReasonTableProps) {
  const getTypeBadge = (type: InventoryReasonType) => {
    switch (type) {
      case 'INPUT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Entrada (+)
          </span>
        );
      case 'OUTPUT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            Salida (-)
          </span>
        );
      case 'BOTH':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            Ambos (+/-)
          </span>
        );
    }
  };

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
          <tr>
            <th className="py-3.5 px-4">Nombre del Motivo</th>
            <th className="py-3.5 px-4 text-center">Tipo de Movimiento</th>
            <th className="py-3.5 px-4">Descripción</th>
            <th className="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[var(--color-text-muted)]">
                Cargando motivos...
              </td>
            </tr>
          ) : reasons.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[var(--color-text-muted)]">
                No hay motivos registrados.
              </td>
            </tr>
          ) : (
            reasons.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="py-3.5 px-4 font-medium text-[var(--color-text-primary)]">{r.name}</td>
                <td className="py-3.5 px-4 text-center">{getTypeBadge(r.type)}</td>
                <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">{r.description || '-'}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(r)}
                      className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-bg)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
