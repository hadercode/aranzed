import { Edit, Ban, Trash2 } from "lucide-react";
import type { Sale } from "../../types";

interface SaleAdminActionsProps {
  sale: Sale;
  isCompleted: boolean;
  isCancelled: boolean;
  onExecute: (action: () => void) => void;
  onEdit: (id: string) => void;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

export function SaleAdminActions({
  sale,
  isCompleted,
  isCancelled,
  onExecute,
  onEdit,
  onCancel,
  onDelete,
}: SaleAdminActionsProps) {
  return (
    <div className="py-1">
      {/* Editar */}
      {!isCompleted && !isCancelled && (
        <button
          type="button"
          onClick={() => onExecute(() => onEdit(sale.id))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-amber-600"
        >
          <Edit className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Editar Documento</span>
        </button>
      )}

      {/* Anular */}
      {!isCancelled && (
        <button
          type="button"
          onClick={() => onExecute(() => onCancel(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
        >
          <Ban className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Anular Documento</span>
        </button>
      )}

      {/* Eliminar (solo borrador o anulada) */}
      {(sale.status === "DRAFT" || isCancelled) && (
        <button
          type="button"
          onClick={() => onExecute(() => onDelete(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer font-medium"
        >
          <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Eliminar Registro</span>
        </button>
      )}
    </div>
  );
}

