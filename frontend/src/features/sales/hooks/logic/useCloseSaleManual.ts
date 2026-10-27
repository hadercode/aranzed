import React, { useState } from 'react';
import { useSalePaymentMutations } from '../mutations';
import type { Sale } from '../../types';

interface UseCloseSaleManualOptions {
  sale: Sale;
  onSuccess: () => void;
  onClose: () => void;
}

export function useCloseSaleManual({
  sale,
  onSuccess,
  onClose,
}: UseCloseSaleManualOptions) {
  const pendingUsd = Math.max(
    0,
    Number((sale.total - (sale.paidAmount || 0)).toFixed(2)),
  );

  const [differenceAdjustment, setDifferenceAdjustment] =
    useState<number>(pendingUsd);
  const [reason, setReason] = useState<string>(
    'Ajuste de centavos / Redondeo de caja',
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const { closeSaleManually, isClosing, closeError } =
    useSalePaymentMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!reason.trim()) {
      setLocalError('Debes indicar el motivo del cierre manual');
      return;
    }

    try {
      await closeSaleManually({
        saleId: sale.id,
        data: {
          differenceAdjustment: Number(differenceAdjustment) || 0,
          reason: reason.trim(),
        },
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cerrar la venta manualmente';
      setLocalError(msg);
    }
  };

  return {
    pendingUsd,
    differenceAdjustment,
    setDifferenceAdjustment,
    reason,
    setReason,
    isSubmitting: isClosing,
    error: localError || (closeError instanceof Error ? closeError.message : null),
    handleSubmit,
  };
}
