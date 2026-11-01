import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingSalesQuery } from '../queries';
import { useSalePaymentMutations } from '../mutations';
import type { PaymentMethod } from '../../types';
import { useSalePaymentAllocations } from './useSalePaymentAllocations';
import { validateAndBuildSalePaymentPayload } from './salePaymentPayload';

export function useSalePaymentFormPage() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState<string>('');
  const [customerTaxId, setCustomerTaxId] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(
    () => new Date().toISOString().split('T')[0],
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [reference, setReference] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'VES'>('USD');
  const [totalPaymentAmount, setTotalPaymentAmount] = useState<number>(0);
  const [exchangeRateOverride, setExchangeRateOverride] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const { pendingSales, isLoading: isLoadingPending, refetch: refetchPending } =
    usePendingSalesQuery(customerName);

  const { createPayment, uploadReceipt, isCreating, isUploading, createError, uploadError } =
    useSalePaymentMutations();

  const defaultExchangeRate =
    pendingSales.length > 0 && pendingSales[0].exchangeRate > 0 ? pendingSales[0].exchangeRate : 1.0;
  const exchangeRate = exchangeRateOverride ?? defaultExchangeRate;

  const totalAmountUsd = useMemo(() => {
    if (currency === 'USD') return totalPaymentAmount;
    const rate = exchangeRate > 0 ? exchangeRate : 1;
    return Number((totalPaymentAmount / rate).toFixed(4));
  }, [currency, totalPaymentAmount, exchangeRate]);

  const totalAmountVes = useMemo(() => {
    if (currency === 'VES') return totalPaymentAmount;
    const rate = exchangeRate > 0 ? exchangeRate : 1;
    return Number((totalPaymentAmount * rate).toFixed(4));
  }, [currency, totalPaymentAmount, exchangeRate]);

  const allocationsData = useSalePaymentAllocations({
    totalAmountUsd,
    pendingSales,
    setFormError,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setFormError(null);
      const res = await uploadReceipt(file);
      setReceiptUrl(res.url);
      setReceiptFileName(file.name);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al subir comprobante');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const { payload, error } = validateAndBuildSalePaymentPayload({
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
      allocations: allocationsData.allocations,
      pendingSales,
    });

    if (error || !payload) {
      setFormError(error || 'Datos inválidos');
      return;
    }

    try {
      await createPayment(payload);
      navigate('/sales/payments');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error al registrar el cobro');
    }
  };

  return {
    customerName,
    setCustomerName,
    customerTaxId,
    setCustomerTaxId,
    paymentDate,
    setPaymentDate,
    paymentMethod,
    setPaymentMethod,
    reference,
    setReference,
    currency,
    setCurrency,
    totalPaymentAmount,
    setTotalPaymentAmount,
    exchangeRate,
    setExchangeRate: (val: number) => setExchangeRateOverride(val),
    notes,
    setNotes,
    receiptUrl,
    receiptFileName,
    handleFileUpload,
    handleRemoveReceipt: () => {
      setReceiptUrl('');
      setReceiptFileName('');
    },
    pendingSales,
    isLoadingPending,
    refetchPending,
    ...allocationsData,
    totalAmountUsd,
    totalAmountVes,
    isSubmitting: isCreating,
    isUploading,
    error: formError || (createError instanceof Error ? createError.message : null) || (uploadError instanceof Error ? uploadError.message : null),
    handleSubmit,
    handleCancel: () => navigate('/sales/payments'),
  };
}
