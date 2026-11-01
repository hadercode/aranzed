import { Modal, Button } from "@/shared/components/ui";
import type { InventoryTransaction } from "../../types";
import {
  getTransactionTypeBadge,
  getTransactionStatusBadge,
} from "./TransactionBadges";
import { TransactionDetailItemsList } from "./TransactionDetailItemsList";

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Transacción: ${transaction.transactionNumber}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              Tipo
            </span>
            <div className="mt-1">
              {getTransactionTypeBadge(transaction.type)}
            </div>
          </div>
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              Estado
            </span>
            <div className="mt-1">
              {getTransactionStatusBadge(transaction.status)}
            </div>
          </div>
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              Fecha Movimiento
            </span>
            <span className="text-xs font-mono font-medium text-[var(--color-text-primary)] block mt-1.5">
              {transaction.movementDate
                ? transaction.movementDate.slice(0, 10)
                : "—"}
            </span>
          </div>
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              Motivo
            </span>
            <span className="text-xs font-medium text-[var(--color-text-primary)] block mt-1.5">
              {transaction.reason?.name || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">
              Almacén Origen:
            </span>
            <span className="text-[var(--color-text-primary)]">
              {transaction.originWarehouse
                ? `${transaction.originWarehouse.name} (${transaction.originWarehouse.code})`
                : "No aplica"}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">
              Almacén Destino:
            </span>
            <span className="text-[var(--color-text-primary)]">
              {transaction.destWarehouse
                ? `${transaction.destWarehouse.name} (${transaction.destWarehouse.code})`
                : "No aplica"}
            </span>
          </div>
        </div>

        {transaction.notes && (
          <div className="text-xs p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
            <span className="font-semibold text-[var(--color-text-secondary)] block mb-1">
              Notas:
            </span>
            <p className="text-[var(--color-text-primary)]">
              {transaction.notes}
            </p>
          </div>
        )}

        {transaction.items && transaction.items.length > 0 && (
          <TransactionDetailItemsList items={transaction.items} />
        )}

        <div className="flex justify-end pt-2 border-t border-[var(--color-border)]">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default TransactionDetailModal;
