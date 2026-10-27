import React, { useState, useMemo } from 'react';
import { useSalePaymentMutations } from '../mutations';
import type { Sale, PaymentMethod, CreateSalePaymentPayload } from '../../types';

interface UseQuickPaymentOptions {
  sale: Sale;
  onSuccess: (updatedSale?: Sale) => void;
  onClose: () => void;
}

export function useQuickPayment({
  sale,
  onSuccess,
  onClose,
}: UseQuickPaymentOptions) {
  const rate = sale.exchangeRate > 0 ? sale.exchangeRate : 1.0;
  const pendingBalanceUsd = Math.max(
    0,
    Number((sale.total - (sale.paidAmount || 0)).toFixed(2)),
  );
  const pendingBalanceVes = Math.max(
    0,
    Number((sale.totalLocal - (sale.paidAmountLocal || 0)).toFixed(2)),
  );

  const [paymentDate, setPaymentDate] = useState<string>(
    () => new Date().toISOString().split('T')[0],
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [reference, setReference] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'VES'>('USD');
  const [amount, setAmount] = useState<number>(pendingBalanceUsd);
  const [exchangeRate, setExchangeRate] = useState<number>(rate);
  const [notes, setNotes] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [closeIfSmallDifference, setCloseIfSmallDifference] =
    useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    createPayment,
    uploadReceipt,
    isCreating,
    isUploading,
    createError,
    uploadError,
  } = useSalePaymentMutations();

  const amountUsd = useMemo(() => {
    if (currency === 'USD') return amount;
    return Number((amount / (exchangeRate > 0 ? exchangeRate : 1)).toFixed(4));
  }, [currency, amount, exchangeRate]);

  const amountVes = useMemo(() => {
    if (currency === 'VES') return amount;
    return Number((amount * (exchangeRate > 0 ? exchangeRate : 1)).toFixed(4));
  }, [currency, amount, exchangeRate]);

  const remainingAfterPayment = useMemo(() => {
    return Math.max(0, Number((pendingBalanceUsd - amountUsd).toFixed(2)));
  }, [pendingBalanceUsd, amountUsd]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLocalError(null);
      const res = await uploadReceipt(file);
      setReceiptUrl(res.url);
      setReceiptFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el comprobante';
      setLocalError(msg);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptUrl('');
    setReceiptFileName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (amount <= 0) {
      setLocalError('El monto a cobrar debe ser mayor a 0');
      return;
    }

    try {
      const shouldClose =
        closeIfSmallDifference &&
        remainingAfterPayment > 0 &&
        remainingAfterPayment <= 0.05;

      const payload: CreateSalePaymentPayload = {
        customerName: sale.customerName,
        customerTaxId: sale.customerTaxId || undefined,
        paymentDate,
        paymentMethod,
        reference: reference.trim() || undefined,
        currency,
        amount: amountUsd,
        amountLocal: amountVes,
        exchangeRate: exchangeRate > 0 ? exchangeRate : 1.0,
        receiptUrl: receiptUrl || undefined,
        notes: notes.trim() || undefined,
        allocations: [
          {
            saleId: sale.id,
            amountAllocated: amountUsd,
            differenceAdjustment: shouldClose ? remainingAfterPayment : 0,
          },
        ],
      };

      await createPayment(payload);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el cobro';
      setLocalError(msg);
    }
  };

  return {
    pendingBalanceUsd,
    pendingBalanceVes,
    paymentDate,
    setPaymentDate,
    paymentMethod,
    setPaymentMethod,
    reference,
    setReference,
    currency,
    setCurrency,
    amount,
    setAmount,
    exchangeRate,
    setExchangeRate,
    notes,
    setNotes,
    receiptUrl,
    receiptFileName,
    handleFileUpload,
    handleRemoveReceipt,
    closeIfSmallDifference,
    setCloseIfSmallDifference,
    amountUsd,
    amountVes,
    remainingAfterPayment,
    isSubmitting: isCreating,
    isUploading,
    error: localError || (createError instanceof Error ? createError.message : null) || (uploadError instanceof Error ? uploadError.message : null),
    handleSubmit,
  };
}
