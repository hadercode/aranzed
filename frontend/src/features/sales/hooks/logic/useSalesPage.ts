import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalesQuery } from '../queries/useSalesQuery';
import { useSaleMutations } from '../mutations/useSaleMutations';
import { useSalesStore } from '../../store';
import type { Sale, SaleFilters, SalePaidStatus } from '../../types';
import { useSalesPageOperations } from './useSalesPageOperations';

export function useSalesPage() {
  const navigate = useNavigate();
  const store = useSalesStore();

  const filters = useMemo<SaleFilters>(
    () => ({
      search: store.searchTerm.trim() || undefined,
      saleType: store.typeFilter !== 'ALL' ? store.typeFilter : undefined,
      paymentTerm: store.paymentTermFilter !== 'ALL' ? store.paymentTermFilter : undefined,
      paidStatus: store.paidStatusFilter !== 'ALL' ? store.paidStatusFilter : undefined,
      status: store.statusFilter !== 'ALL' ? store.statusFilter : undefined,
      startDate: store.startDate || undefined,
      endDate: store.endDate || undefined,
    }),
    [
      store.searchTerm,
      store.typeFilter,
      store.paymentTermFilter,
      store.paidStatusFilter,
      store.statusFilter,
      store.startDate,
      store.endDate,
    ]
  );

  const { sales, total, stats, isLoading, isError, error, refetch } = useSalesQuery(filters);
  const mutations = useSaleMutations();
  const { handleExportExcel, handleExportPdf, handlePrintSale } = useSalesPageOperations({
    filters,
    setActionError: store.setActionError,
  });

  const handleConfirmSale = async () => {
    if (!store.confirmSaleTarget) return;
    try {
      await mutations.updateStatus({ id: store.confirmSaleTarget.id, status: 'COMPLETED' });
      store.setConfirmSaleTarget(null);
      await refetch();
    } catch (err: unknown) {
      store.setActionError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleConvertQuotation = async () => {
    if (!store.convertQuotationTarget) return;
    try {
      await mutations.convertQuotation(store.convertQuotationTarget.id);
      store.setConvertQuotationTarget(null);
      await refetch();
    } catch (err: unknown) {
      store.setActionError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleCancelSale = async () => {
    if (!store.cancelSaleTarget) return;
    try {
      await mutations.updateStatus({
        id: store.cancelSaleTarget.id,
        status: 'CANCELLED',
        cancelReason: store.cancelReason || undefined,
      });
      store.setCancelSaleTarget(null);
      store.setCancelReason('');
      await refetch();
    } catch (err: unknown) {
      store.setActionError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteSale = async () => {
    if (!store.deleteSaleTarget) return;
    try {
      await mutations.deleteSale(store.deleteSaleTarget.id);
      store.setDeleteSaleTarget(null);
      await refetch();
    } catch (err: unknown) {
      store.setActionError(err instanceof Error ? err.message : String(err));
    }
  };

  const paginatedSales = useMemo(() => {
    const start = (store.currentPage - 1) * store.pageSize;
    return sales.slice(start, start + store.pageSize);
  }, [sales, store.currentPage, store.pageSize]);

  return {
    ...store,
    sales: paginatedSales,
    rawSales: sales,
    totalCount: total || sales.length,
    stats,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateSale: () => navigate('/sales/new?type=DIRECT_SALE'),
    handleCreateQuotation: () => navigate('/sales/new?type=QUOTATION'),
    handleEditSale: (id: string) => navigate(`/sales/${id}/edit`),
    handleExportExcel,
    handleExportPdf,
    handlePrintSale,
    handleGoToPayments: () => navigate('/sales/payments'),
    handleGoToNewPayment: () => navigate('/sales/payments/new'),
    handlePaymentSuccess: async () => {
      await refetch();
    },
    handleConfirmSale,
    isChangingStatus: mutations.isChangingStatus,
    handleConvertQuotation,
    isConverting: mutations.isConverting,
    handleCancelSale,
    handleDeleteSale,
    handleUpdatePaidStatus: async (sale: Sale, newStatus: SalePaidStatus) => {
      try {
        await mutations.updatePaidStatus({ id: sale.id, paidStatus: newStatus });
        await refetch();
      } catch (err: unknown) {
        store.setActionError(err instanceof Error ? err.message : String(err));
      }
    },
    isChangingPaidStatus: mutations.isChangingPaidStatus,
    isDeleting: mutations.isDeleting,
  };
}

export type UseSalesPageReturn = ReturnType<typeof useSalesPage>;
