import { useState, useMemo } from 'react';
import { useSalePaymentsQuery } from '../queries';
import { useSalePaymentMutations } from '../mutations';
import type { SalePayment, PaymentMethod, PaymentStatus, SalePaymentFilters } from '../../types';

export function useSalePaymentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Modales
  const [viewerReceiptUrl, setViewerReceiptUrl] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<SalePayment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);

  const filters: SalePaymentFilters = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      paymentMethod: methodFilter !== 'ALL' ? methodFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [searchTerm, methodFilter, statusFilter, startDate, endDate],
  );

  const { payments, total, stats, isLoading, isFetching, refetch } =
    useSalePaymentsQuery(filters);

  const { cancelPayment, isCancelling } = useSalePaymentMutations();

  const handleOpenCancel = (payment: SalePayment) => {
    setCancelTarget(payment);
    setCancelReason('');
    setActionError(null);
  };

  const handleCloseCancel = () => {
    setCancelTarget(null);
    setCancelReason('');
    setActionError(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setActionError(null);
      await cancelPayment({ id: cancelTarget.id, reason: cancelReason.trim() || undefined });
      handleCloseCancel();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al anular el cobro';
      setActionError(msg);
    }
  };

  const handleOpenReceipt = (url: string) => {
    setViewerReceiptUrl(url);
  };

  const handleCloseReceipt = () => {
    setViewerReceiptUrl(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMethodFilter('ALL');
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return {
    // Data
    payments,
    total,
    stats,
    isLoading,
    isFetching,
    refetch,

    // Filters
    searchTerm,
    setSearchTerm,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleClearFilters,

    // Modal Cancel
    cancelTarget,
    cancelReason,
    setCancelReason,
    isCancelling,
    actionError,
    handleOpenCancel,
    handleCloseCancel,
    handleConfirmCancel,

    // Modal Receipt
    viewerReceiptUrl,
    handleOpenReceipt,
    handleCloseReceipt,
  };
}
