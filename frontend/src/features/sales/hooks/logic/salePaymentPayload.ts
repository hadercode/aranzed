import type { PaymentMethod, CreateSalePaymentPayload, PendingSaleForPayment } from '../../types';

interface BuildPayloadParams {
  customerName: string;
  customerTaxId: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  currency: 'USD' | 'VES';
  totalAmountUsd: number;
  totalAmountVes: number;
  exchangeRate: number;
  receiptUrl: string;
  notes: string;
  allocations: Record<string, { amount: number; closeWithDiff: boolean }>;
  pendingSales: PendingSaleForPayment[];
}

export function validateAndBuildSalePaymentPayload({
  customerName,
  customerTaxId,
  paymentDate,
  paymentMethod,
  reference,
  currency,
  totalAmountUsd,
  totalAmountVes,
  exchangeRate,
  receiptUrl,
  notes,
  allocations,
  pendingSales,
}: BuildPayloadParams): { payload?: CreateSalePaymentPayload; error?: string } {
  if (totalAmountUsd <= 0) {
    return { error: 'El monto total del cobro debe ser mayor a 0' };
  }

  const validAllocations = Object.entries(allocations)
    .filter(([, data]) => data.amount > 0)
    .map(([saleId, data]) => {
      const targetSale = pendingSales.find((s) => s.id === saleId);
      const saleBal = targetSale?.balance ?? data.amount;
      const remainingDiff = Math.max(0, Number((saleBal - data.amount).toFixed(2)));
      const diffAdj = data.closeWithDiff && remainingDiff <= 0.05 ? remainingDiff : 0;

      return {
        saleId,
        amountAllocated: data.amount,
        differenceAdjustment: diffAdj,
      };
    });

  if (validAllocations.length === 0) {
    return { error: 'Debes asignar el monto al menos a una venta pendiente' };
  }

  const totalAllocated = Object.values(allocations).reduce(
    (sum, it) => sum + (it.amount || 0),
    0,
  );
  if (totalAllocated > totalAmountUsd + 0.01) {
    return {
      error: `El monto asignado ($${totalAllocated.toFixed(2)}) supera el total ($${totalAmountUsd.toFixed(2)})`,
    };
  }

  const payload: CreateSalePaymentPayload = {
    customerName: customerName.trim() || 'Cliente General',
    customerTaxId: customerTaxId.trim() || undefined,
    paymentDate,
    paymentMethod,
    reference: reference.trim() || undefined,
    currency,
    amount: totalAmountUsd,
    amountLocal: totalAmountVes,
    exchangeRate: exchangeRate > 0 ? exchangeRate : 1.0,
    receiptUrl: receiptUrl || undefined,
    notes: notes.trim() || undefined,
    allocations: validAllocations,
  };

  return { payload };
}
