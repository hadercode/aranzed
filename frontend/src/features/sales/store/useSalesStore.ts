import { create } from 'zustand';
import type {
  Sale,
  SalePaidStatus,
  SalePaymentTerm,
  SaleStatus,
  SaleType,
} from '../types';

export interface SalesState {
  // Filtros
  searchTerm: string;
  typeFilter: SaleType | 'ALL';
  paymentTermFilter: SalePaymentTerm | 'ALL';
  paidStatusFilter: SalePaidStatus | 'ALL';
  statusFilter: SaleStatus | 'ALL';
  startDate: string;
  endDate: string;
  currentPage: number;
  pageSize: number;

  // Modales y targets
  previewSaleTarget: Sale | null;
  confirmSaleTarget: Sale | null;
  convertQuotationTarget: Sale | null;
  cancelSaleTarget: Sale | null;
  deleteSaleTarget: Sale | null;
  quickPaymentTarget: Sale | null;
  closeManualTarget: Sale | null;
  paymentsHistoryTarget: Sale | null;
  whatsAppSaleTarget: Sale | null;
  cancelReason: string;
  actionError: string | null;

  // Acciones de filtros
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: SaleType | 'ALL') => void;
  setPaymentTermFilter: (term: SalePaymentTerm | 'ALL') => void;
  setPaidStatusFilter: (status: SalePaidStatus | 'ALL') => void;
  setStatusFilter: (status: SaleStatus | 'ALL') => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;

  // Acciones de modales
  setPreviewSaleTarget: (sale: Sale | null) => void;
  setConfirmSaleTarget: (sale: Sale | null) => void;
  setConvertQuotationTarget: (sale: Sale | null) => void;
  setCancelSaleTarget: (sale: Sale | null) => void;
  setDeleteSaleTarget: (sale: Sale | null) => void;
  setQuickPaymentTarget: (sale: Sale | null) => void;
  setCloseManualTarget: (sale: Sale | null) => void;
  setPaymentsHistoryTarget: (sale: Sale | null) => void;
  setWhatsAppSaleTarget: (sale: Sale | null) => void;
  setCancelReason: (reason: string) => void;
  setActionError: (err: string | null) => void;
  resetUIState: () => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  searchTerm: '',
  typeFilter: 'ALL',
  paymentTermFilter: 'ALL',
  paidStatusFilter: 'ALL',
  statusFilter: 'ALL',
  startDate: '',
  endDate: '',
  currentPage: 1,
  pageSize: 10,

  previewSaleTarget: null,
  confirmSaleTarget: null,
  convertQuotationTarget: null,
  cancelSaleTarget: null,
  deleteSaleTarget: null,
  quickPaymentTarget: null,
  closeManualTarget: null,
  paymentsHistoryTarget: null,
  whatsAppSaleTarget: null,
  cancelReason: '',
  actionError: null,

  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setTypeFilter: (typeFilter) => set({ typeFilter, currentPage: 1 }),
  setPaymentTermFilter: (paymentTermFilter) => set({ paymentTermFilter, currentPage: 1 }),
  setPaidStatusFilter: (paidStatusFilter) => set({ paidStatusFilter, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate, currentPage: 1 }),
  setStartDate: (startDate) => set({ startDate, currentPage: 1 }),
  setEndDate: (endDate) => set({ endDate, currentPage: 1 }),
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),
  resetFilters: () =>
    set({
      searchTerm: '',
      typeFilter: 'ALL',
      paymentTermFilter: 'ALL',
      paidStatusFilter: 'ALL',
      statusFilter: 'ALL',
      startDate: '',
      endDate: '',
      currentPage: 1,
    }),

  setPreviewSaleTarget: (previewSaleTarget) => set({ previewSaleTarget }),
  setConfirmSaleTarget: (confirmSaleTarget) => set({ confirmSaleTarget }),
  setConvertQuotationTarget: (convertQuotationTarget) => set({ convertQuotationTarget }),
  setCancelSaleTarget: (cancelSaleTarget) => set({ cancelSaleTarget }),
  setDeleteSaleTarget: (deleteSaleTarget) => set({ deleteSaleTarget }),
  setQuickPaymentTarget: (quickPaymentTarget) => set({ quickPaymentTarget }),
  setCloseManualTarget: (closeManualTarget) => set({ closeManualTarget }),
  setPaymentsHistoryTarget: (paymentsHistoryTarget) => set({ paymentsHistoryTarget }),
  setWhatsAppSaleTarget: (whatsAppSaleTarget) => set({ whatsAppSaleTarget }),
  setCancelReason: (cancelReason) => set({ cancelReason }),
  setActionError: (actionError) => set({ actionError }),

  resetUIState: () =>
    set({
      previewSaleTarget: null,
      confirmSaleTarget: null,
      convertQuotationTarget: null,
      cancelSaleTarget: null,
      deleteSaleTarget: null,
      quickPaymentTarget: null,
      closeManualTarget: null,
      paymentsHistoryTarget: null,
      whatsAppSaleTarget: null,
      cancelReason: '',
      actionError: null,
    }),
}));
