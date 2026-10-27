import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalesQuery } from '../queries/useSalesQuery';
import { useSaleMutations } from '../mutations/useSaleMutations';
import { salesService } from '../../services';
import type { Sale, SaleFilters, SalePaidStatus, SalePaymentTerm, SaleStatus, SaleType } from '../../types';

export function useSalesPage() {
  const navigate = useNavigate();

  // 1. Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<SaleType | 'ALL'>('ALL');
  const [paymentTermFilter, setPaymentTermFilter] = useState<SalePaymentTerm | 'ALL'>('ALL');
  const [paidStatusFilter, setPaidStatusFilter] = useState<SalePaidStatus | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filters = useMemo<SaleFilters>(() => ({
    search: searchTerm.trim() || undefined,
    saleType: typeFilter !== 'ALL' ? typeFilter : undefined,
    paymentTerm: paymentTermFilter !== 'ALL' ? paymentTermFilter : undefined,
    paidStatus: paidStatusFilter !== 'ALL' ? paidStatusFilter : undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [searchTerm, typeFilter, paymentTermFilter, paidStatusFilter, statusFilter, startDate, endDate]);

  const { sales, total, stats, isLoading, isError, error, refetch } = useSalesQuery(filters);

  // 2. Modales y Diálogos de acción
  const [previewSaleTarget, setPreviewSaleTarget] = useState<Sale | null>(null);
  const [confirmSaleTarget, setConfirmSaleTarget] = useState<Sale | null>(null);
  const [convertQuotationTarget, setConvertQuotationTarget] = useState<Sale | null>(null);
  const [cancelSaleTarget, setCancelSaleTarget] = useState<Sale | null>(null);
  const [deleteSaleTarget, setDeleteSaleTarget] = useState<Sale | null>(null);
  const [quickPaymentTarget, setQuickPaymentTarget] = useState<Sale | null>(null);
  const [closeManualTarget, setCloseManualTarget] = useState<Sale | null>(null);
  const [paymentsHistoryTarget, setPaymentsHistoryTarget] = useState<Sale | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    updateStatus,
    updatePaidStatus,
    convertQuotation,
    deleteSale,
    isChangingStatus,
    isChangingPaidStatus,
    isConverting,
    isDeleting,
  } = useSaleMutations();

  // 3. Handlers de navegación
  const handleCreateSale = () => navigate('/sales/new?type=DIRECT_SALE');
  const handleCreateQuotation = () => navigate('/sales/new?type=QUOTATION');
  const handleEditSale = (id: string) => navigate(`/sales/${id}/edit`);

  // 4. Handlers de exportación
  const handleExportExcel = async () => {
    try {
      await salesService.exportExcel(filters);
    } catch (err: any) {
      setActionError('Error al exportar a Excel: ' + (err.message || String(err)));
    }
  };

  const handleExportPdf = async () => {
    try {
      await salesService.exportPdf(filters);
    } catch (err: any) {
      setActionError('Error al exportar a PDF: ' + (err.message || String(err)));
    }
  };

  const handlePrintSale = async (sale: Sale) => {
    try {
      const url = await salesService.getSalePdfBlobUrl(sale.id);
      window.open(url, '_blank');
    } catch (err: any) {
      setActionError('Error al generar el comprobante PDF: ' + (err.message || String(err)));
    }
  };

  // 5. Confirmaciones y mutaciones
  const handleConfirmSale = async () => {
    if (!confirmSaleTarget) return;
    try {
      await updateStatus({ id: confirmSaleTarget.id, status: 'COMPLETED' });
      setConfirmSaleTarget(null);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || String(err));
    }
  };

  const handleConvertQuotation = async () => {
    if (!convertQuotationTarget) return;
    try {
      await convertQuotation(convertQuotationTarget.id);
      setConvertQuotationTarget(null);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || String(err));
    }
  };

  const handleCancelSale = async () => {
    if (!cancelSaleTarget) return;
    try {
      await updateStatus({
        id: cancelSaleTarget.id,
        status: 'CANCELLED',
        cancelReason: cancelReason || undefined,
      });
      setCancelSaleTarget(null);
      setCancelReason('');
      await refetch();
    } catch (err: any) {
      setActionError(err.message || String(err));
    }
  };

  const handleDeleteSale = async () => {
    if (!deleteSaleTarget) return;
    try {
      await deleteSale(deleteSaleTarget.id);
      setDeleteSaleTarget(null);
      await refetch();
    } catch (err: any) {
      setActionError(err.message || String(err));
    }
  };

  // Paginación en cliente
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sales.slice(start, start + pageSize);
  }, [sales, currentPage, pageSize]);

  return {
    sales: paginatedSales,
    rawSales: sales,
    totalCount: total || sales.length,
    stats,
    isLoading,
    isError,
    error,
    refetch,
    // Filtros
    searchTerm,
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
    },
    typeFilter,
    setTypeFilter: (type: SaleType | 'ALL') => {
      setTypeFilter(type);
      setCurrentPage(1);
    },
    paymentTermFilter,
    setPaymentTermFilter: (term: SalePaymentTerm | 'ALL') => {
      setPaymentTermFilter(term);
      setCurrentPage(1);
    },
    paidStatusFilter,
    setPaidStatusFilter: (paid: SalePaidStatus | 'ALL') => {
      setPaidStatusFilter(paid);
      setCurrentPage(1);
    },
    statusFilter,
    setStatusFilter: (st: SaleStatus | 'ALL') => {
      setStatusFilter(st);
      setCurrentPage(1);
    },
    startDate,
    setStartDate: (d: string) => {
      setStartDate(d);
      setCurrentPage(1);
    },
    endDate,
    setEndDate: (d: string) => {
      setEndDate(d);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    pageSize,
    // Acciones y Navegación
    handleCreateSale,
    handleCreateQuotation,
    handleEditSale,
    handleExportExcel,
    handleExportPdf,
    handlePrintSale,
    handleGoToPayments: () => navigate('/sales/payments'),
    handleGoToNewPayment: () => navigate('/sales/payments/new'),
    handlePaymentSuccess: async () => {
      await refetch();
    },
    // Modales y confirmaciones
    previewSaleTarget,
    setPreviewSaleTarget,
    confirmSaleTarget,
    setConfirmSaleTarget,
    handleConfirmSale,
    isChangingStatus,
    convertQuotationTarget,
    setConvertQuotationTarget,
    handleConvertQuotation,
    isConverting,
    cancelSaleTarget,
    setCancelSaleTarget,
    cancelReason,
    setCancelReason,
    handleCancelSale,
    deleteSaleTarget,
    setDeleteSaleTarget,
    handleDeleteSale,
    quickPaymentTarget,
    setQuickPaymentTarget,
    closeManualTarget,
    setCloseManualTarget,
    paymentsHistoryTarget,
    setPaymentsHistoryTarget,
    handleUpdatePaidStatus: async (sale: Sale, newStatus: SalePaidStatus) => {
      try {
        await updatePaidStatus({ id: sale.id, paidStatus: newStatus });
        await refetch();
      } catch (err: any) {
        setActionError(err.message || String(err));
      }
    },
    isChangingPaidStatus,
    isDeleting,
    actionError,
    setActionError,
  };
}

export type UseSalesPageReturn = ReturnType<typeof useSalesPage>;
