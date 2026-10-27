import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingSalesQuery } from '../queries';
import { useSalePaymentMutations } from '../mutations';
import type { PaymentMethod, CreateSalePaymentPayload } from '../../types';

export function useSalePaymentFormPage() {
  const navigate = useNavigate();

  // Encabezado del Cobro
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

  // Comprobante
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');

  // Asignaciones por venta: { [saleId]: { amount: number; closeWithDiff: boolean } }
  const [allocations, setAllocations] = useState<
    Record<string, { amount: number; closeWithDiff: boolean }>
  >({});

  // Error de validación local
  const [formError, setFormError] = useState<string | null>(null);

  // TanStack Query para ventas pendientes
  const { pendingSales, isLoading: isLoadingPending, refetch: refetchPending } =
    usePendingSalesQuery(customerName);

  // TanStack Mutations
  const {
    createPayment,
    uploadReceipt,
    isCreating,
    isUploading,
    createError,
    uploadError,
  } = useSalePaymentMutations();

  // Si las ventas pendientes tienen una tasa común y el usuario no ha ingresado una propia, usar la de la primera venta
  const defaultExchangeRate =
    pendingSales.length > 0 && pendingSales[0].exchangeRate > 0
      ? pendingSales[0].exchangeRate
      : 1.0;
  const exchangeRate = exchangeRateOverride ?? defaultExchangeRate;
  const setExchangeRate = (val: number) => setExchangeRateOverride(val);

  // Cálculos reactivos de montos
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

  const totalAllocatedUsd = useMemo(() => {
    return Object.values(allocations).reduce(
      (sum, it) => sum + (it.amount || 0),
      0,
    );
  }, [allocations]);

  const remainingToAllocateUsd = useMemo(() => {
    return Number((totalAmountUsd - totalAllocatedUsd).toFixed(2));
  }, [totalAmountUsd, totalAllocatedUsd]);

  // Subida de Comprobante
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFormError(null);
      const res = await uploadReceipt(file);
      setReceiptUrl(res.url);
      setReceiptFileName(file.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen del comprobante';
      setFormError(msg);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptUrl('');
    setReceiptFileName('');
  };

  // Asignar monto a una venta específica
  const handleAllocationChange = (saleId: string, val: number) => {
    setAllocations((prev) => ({
      ...prev,
      [saleId]: {
        amount: Math.max(0, val),
        closeWithDiff: prev[saleId]?.closeWithDiff ?? false,
      },
    }));
  };

  // Toggle de cierre con diferencia para una venta
  const handleToggleCloseDiff = (saleId: string, checked: boolean) => {
    setAllocations((prev) => ({
      ...prev,
      [saleId]: {
        amount: prev[saleId]?.amount ?? 0,
        closeWithDiff: checked,
      },
    }));
  };

  // Auto-distribuir monto entre las ventas pendientes (FIFO)
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

    // Ordenar de más antigua a más reciente
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

  // Limpiar asignaciones
  const handleClearAllocations = () => {
    setAllocations({});
  };

  // Asignar todo el saldo restante a una venta específica
  const handleFillMaxForSale = (sale: { id: string; balance: number }) => {
    const currentAlloc = allocations[sale.id]?.amount || 0;
    const maxAvailable = remainingToAllocateUsd + currentAlloc;
    const need = sale.balance;
    const target = Math.min(maxAvailable, need);

    handleAllocationChange(sale.id, Number(target.toFixed(2)));
  };

  // Envío del Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (totalAmountUsd <= 0) {
      setFormError('El monto total del cobro debe ser mayor a 0');
      return;
    }

    // Filtrar solo asignaciones válidas
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
      setFormError('Debes asignar el monto al menos a una venta pendiente');
      return;
    }

    if (totalAllocatedUsd > totalAmountUsd + 0.01) {
      setFormError(
        `El monto asignado ($${totalAllocatedUsd.toFixed(2)}) supera el monto total del pago ($${totalAmountUsd.toFixed(2)})`,
      );
      return;
    }

    try {
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

      await createPayment(payload);
      navigate('/sales/payments');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el cobro';
      setFormError(msg);
    }
  };

  return {
    // Encabezado
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
    setExchangeRate,
    notes,
    setNotes,

    // Comprobante
    receiptUrl,
    receiptFileName,
    handleFileUpload,
    handleRemoveReceipt,

    // Ventas y Asignaciones
    pendingSales,
    isLoadingPending,
    refetchPending,
    allocations,
    handleAllocationChange,
    handleToggleCloseDiff,
    handleAutoDistribute,
    handleClearAllocations,
    handleFillMaxForSale,

    // Cálculos
    totalAmountUsd,
    totalAmountVes,
    totalAllocatedUsd,
    remainingToAllocateUsd,

    // Estado & Envío
    isSubmitting: isCreating,
    isUploading,
    error: formError || (createError instanceof Error ? createError.message : null) || (uploadError instanceof Error ? uploadError.message : null),
    handleSubmit,
    handleCancel: () => navigate('/sales/payments'),
  };
}
