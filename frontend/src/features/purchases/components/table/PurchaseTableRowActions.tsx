import { Eye, CheckCircle, Trash2 } from 'lucide-react';
import type { Purchase } from '../../types';

export interface PurchaseTableRowActionsProps {
  purchase: Purchase;
  onView: (purchase: Purchase) => void;
  onComplete: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
}

export function PurchaseTableRowActions({
  purchase,
  onView,
  onComplete,
  onDelete,
}: PurchaseTableRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onView(purchase)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
        title="Ver detalle de la compra"
      >
        <Eye className="w-4 h-4" />
      </button>

      {purchase.status === 'DRAFT' && (
        <button
          type="button"
          onClick={() => onComplete(purchase)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
          title="Completar compra (Emite evento para stock)"
        >
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </button>
      )}

      {purchase.status === 'DRAFT' && (
        <button
          type="button"
          onClick={() => onDelete(purchase)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
          title="Eliminar borrador"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
        </button>
      )}
    </div>
  );
}

