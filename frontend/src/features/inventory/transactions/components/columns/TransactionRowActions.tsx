import { Eye, Ban, Edit2 } from "lucide-react";
import type { InventoryTransaction } from "../../types";

interface TransactionRowActionsProps {
  tx: InventoryTransaction;
  onViewDetails: (tx: InventoryTransaction) => void;
  onCancelTx: (tx: InventoryTransaction) => void;
  onEdit?: (tx: InventoryTransaction) => void;
}

export function TransactionRowActions({
  tx,
  onViewDetails,
  onCancelTx,
  onEdit,
}: TransactionRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onViewDetails(tx)}
        className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-sage-600)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors cursor-pointer"
        title="Ver detalle"
      >
        <Eye className="w-4 h-4" />
      </button>
      {tx.status === "DRAFT" && onEdit && (
        <button
          type="button"
          onClick={() => onEdit(tx)}
          className="p-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
          title="Editar borrador"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {tx.status !== "CANCELLED" && (
        <button
          type="button"
          onClick={() => onCancelTx(tx)}
          className="p-1.5 text-[var(--color-text-secondary)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
          title="Anular transacción"
        >
          <Ban className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
