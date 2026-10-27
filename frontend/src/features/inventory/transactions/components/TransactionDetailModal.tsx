import { Modal, Button } from '@/shared/components/ui';
import type {
  InventoryTransaction,
  InventoryTransactionType,
  InventoryTransactionStatus,
} from '../types';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: InventoryTransaction | null;
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const getTypeBadge = (type: InventoryTransactionType) => {
    switch (type) {
      case 'RECEPTION':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Recepción (+)
          </span>
        );
      case 'ISSUE':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            Salida (-)
          </span>
        );
      case 'TRANSFER':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            Transferencia
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            Ajuste
          </span>
        );
      default:
        return <span className="text-xs">{type}</span>;
    }
  };

  const getStatusBadge = (status: InventoryTransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            Completada
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Borrador
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            En Tránsito
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
            Anulada
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Transacción: ${transaction.transactionNumber}`}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[var(--color-surface-bg)] p-3 rounded-xl border border-[var(--color-border)] text-xs">
          <div>
            <span className="text-[var(--color-text-muted)] block">Tipo:</span>
            <span className="font-semibold">{getTypeBadge(transaction.type)}</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)] block">Fecha:</span>
            <span className="font-medium">{transaction.movementDate?.slice(0, 10)}</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)] block">Estado:</span>
            <span>{getStatusBadge(transaction.status)}</span>
          </div>
          <div>
            <span className="text-[var(--color-text-muted)] block">Motivo:</span>
            <span className="font-medium">{transaction.reason?.name || '-'}</span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
              <tr>
                <th className="p-2.5">Producto</th>
                <th className="p-2.5">SKU</th>
                <th className="p-2.5">Lote</th>
                <th className="p-2.5 text-right">Cantidad</th>
                <th className="p-2.5 text-right">Costo Unit.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {transaction.items?.map((it) => (
                <tr key={it.id}>
                  <td className="p-2.5 font-medium">{it.nameSnapshot}</td>
                  <td className="p-2.5 font-mono text-[var(--color-text-muted)]">{it.skuSnapshot}</td>
                  <td className="p-2.5">{it.batchNumber || '-'}</td>
                  <td className="p-2.5 text-right font-semibold">
                    {Number(it.quantity).toFixed(2)} {it.uomSymbol}
                  </td>
                  <td className="p-2.5 text-right font-mono">
                    {it.cost ? `$${Number(it.cost).toFixed(4)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transaction.notes && (
          <div className="text-xs p-2.5 rounded-lg bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)]">
            <span className="font-semibold block mb-0.5">Notas:</span>
            {transaction.notes}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-[var(--color-border)]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
