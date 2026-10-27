import { ConfirmDialog } from '@/shared/components/ui';
import { TransactionDetailModal } from './TransactionDetailModal';
import type { InventoryTransaction } from '../types';

export interface TransactionDialogsProps {
  selectedTx: InventoryTransaction | null;
  onCloseDetails: () => void;
  cancellingTx: InventoryTransaction | null;
  onCloseCancel: () => void;
  onConfirmCancel: () => void;
  isCancelling?: boolean;
}

export function TransactionDialogs({
  selectedTx,
  onCloseDetails,
  cancellingTx,
  onCloseCancel,
  onConfirmCancel,
  isCancelling = false,
}: TransactionDialogsProps) {
  return (
    <>
      {/* Modal de Detalle Completo de Transacción */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        onClose={onCloseDetails}
        transaction={selectedTx}
      />

      {/* Diálogo de Confirmación para Anulación */}
      <ConfirmDialog
        isOpen={Boolean(cancellingTx)}
        title="Anular Transacción de Inventario"
        message={`¿Está seguro de que desea anular la transacción ${cancellingTx?.transactionNumber}? El stock físico será revertido automáticamente si no ha sido consumido.`}
        confirmText="Anular Transacción"
        cancelText="Volver"
        variant="danger"
        loading={isCancelling}
        onConfirm={onConfirmCancel}
        onClose={onCloseCancel}
      />
    </>
  );
}

export default TransactionDialogs;
