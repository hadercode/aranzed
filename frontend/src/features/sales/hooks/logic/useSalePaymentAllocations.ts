import { useState, useMemo } from 'react';
import type { PendingSaleForPayment } from '../../types';

interface UseSalePaymentAllocationsParams {
  totalAmountUsd: number;
  pendingSales: PendingSaleForPayment[];
  setFormError: (err: string | null) => void;
}

export function useSalePaymentAllocations({
  totalAmountUsd,
  pendingSales,
  setFormError,
}: UseSalePaymentAllocationsParams) {
  const [allocations, setAllocations] = useState<
    Record<string, { amount: number; closeWithDiff: boolean }>
  >({});

  const totalAllocatedUsd = useMemo(() => {
    return Object.values(allocations).reduce(
      (sum, it) => sum + (it.amount || 0),
      0,
    );
  }, [allocations]);

  const remainingToAllocateUsd = useMemo(() => {
    return Number((totalAmountUsd - totalAllocatedUsd).toFixed(2));
  }, [totalAmountUsd, totalAllocatedUsd]);

  const handleAllocationChange = (saleId: string, val: number) => {
    setAllocations((prev) => ({
      ...prev,
      [saleId]: {
        amount: Math.max(0, val),
        closeWithDiff: prev[saleId]?.closeWithDiff ?? false,
      },
    }));
  };

  const handleToggleCloseDiff = (saleId: string, checked: boolean) => {
    setAllocations((prev) => ({
      ...prev,
      [saleId]: {
        amount: prev[saleId]?.amount ?? 0,
        closeWithDiff: checked,
      },
    }));
  };

  const handleAutoDistribute = () => {
    if (totalAmountUsd <= 0) {
      setFormError('Primero ingresa el monto total del cobro a distribuir');
      return;
    }
    setFormError(null);

    let budget = totalAmountUsd;
    const newAllocations: Record<
      string,
      { amount: number; closeWithDiff: boolean }
    > = {};

    const sorted = [...pendingSales].sort(
      (a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime(),
    );

    for (const sale of sorted) {
      if (budget <= 0.0001) break;
      const need = sale.balance;
      const assign = Math.min(budget, need);
      const remainingAfter = need - assign;
      const autoClose = remainingAfter > 0 && remainingAfter <= 0.05;

      newAllocations[sale.id] = {
        amount: Number(assign.toFixed(2)),
        closeWithDiff: autoClose,
      };
      budget = Number((budget - assign).toFixed(2));
    }

    setAllocations(newAllocations);
  };

  const handleClearAllocations = () => {
    setAllocations({});
  };

  const handleFillMaxForSale = (sale: { id: string; balance: number }) => {
    const currentAlloc = allocations[sale.id]?.amount || 0;
    const maxAvailable = remainingToAllocateUsd + currentAlloc;
    const need = sale.balance;
    const target = Math.min(maxAvailable, need);

    handleAllocationChange(sale.id, Number(target.toFixed(2)));
  };

  return {
    allocations,
    setAllocations,
    totalAllocatedUsd,
    remainingToAllocateUsd,
    handleAllocationChange,
    handleToggleCloseDiff,
    handleAutoDistribute,
    handleClearAllocations,
    handleFillMaxForSale,
  };
}
