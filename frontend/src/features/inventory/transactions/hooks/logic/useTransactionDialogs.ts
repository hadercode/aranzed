import { useState } from 'react';
import { useFeedbackStore } from '@/shared/hooks/store';
import type { InventoryTransaction } from '../../types';

export interface UseTransactionDialogsOptions {
  onUpdateTransaction: (args: {
    id: string;
    data: { status: 'CANCELLED' };
  }) => Promise<any>;
}

export function useTransactionDialogs({ onUpdateTransaction }: UseTransactionDialogsOptions) {
  const [selectedTx, setSelectedTx] = useState<InventoryTransaction | null>(null);
  const [cancellingTx, setCancellingTx] = useState<InventoryTransaction | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { showSuccess, showError } = useFeedbackStore();

  const openDetails = (tx: InventoryTransaction) => setSelectedTx(tx);
  const closeDetails = () => setSelectedTx(null);

  const openCancel = (tx: InventoryTransaction) => setCancellingTx(tx);
  const closeCancel = () => setCancellingTx(null);

  const confirmCancel = async () => {
    if (!cancellingTx) return;

    try {
      setIsCancelling(true);
      await onUpdateTransaction({
        id: cancellingTx.id,
        data: { status: 'CANCELLED' },
      });
      showSuccess(`Transacción ${cancellingTx.transactionNumber} anulada correctamente.`);
      setCancellingTx(null);
    } catch (err: any) {
      showError(err, { title: 'Error al anular transacción' });
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    selectedTx,
    cancellingTx,
    isCancelling,
    openDetails,
    closeDetails,
    openCancel,
    closeCancel,
    confirmCancel,
  };
}

export type UseTransactionDialogsReturn = ReturnType<typeof useTransactionDialogs>;
