import { create } from 'zustand';
import { useFeedbackStore } from '@/shared/hooks/store';
import type { Purchase, PurchaseStatus } from '../types';

export interface PurchasesState {
  // Filtros y paginación
  searchTerm: string;
  statusFilter: PurchaseStatus | 'ALL';
  currentPage: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;

  // Modales de acción
  completePurchaseTarget: Purchase | null;
  deletePurchaseTarget: Purchase | null;

  // Feedback de acciones
  actionFeedback: string | null;
  actionError: string | null;

  // Acciones de actualización de estado
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: PurchaseStatus | 'ALL') => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number) => void;
  setSort: (sortBy: string | null, sortOrder: 'asc' | 'desc' | null) => void;
  openCompleteModal: (purchase: Purchase) => void;
  closeCompleteModal: () => void;
  openDeleteModal: (purchase: Purchase) => void;
  closeDeleteModal: () => void;
  setActionFeedback: (msg: string | null) => void;
  setActionError: (msg: string | null) => void;
  clearFeedback: () => void;
  clearActionError: () => void;
  resetUIState: () => void;
}

export const usePurchasesStore = create<PurchasesState>((set) => ({
  searchTerm: '',
  statusFilter: 'ALL',
  currentPage: 1,
  pageSize: 10,
  sortBy: 'purchaseDate',
  sortOrder: 'desc',

  completePurchaseTarget: null,
  deletePurchaseTarget: null,

  actionFeedback: null,
  actionError: null,

  setSearchTerm: (searchTerm) =>
    set({ searchTerm, currentPage: 1 }),

  setStatusFilter: (statusFilter) =>
    set({ statusFilter, currentPage: 1 }),

  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),

  setPageSize: (pageSize) =>
    set({ pageSize, currentPage: 1 }),

  setSort: (sortBy, sortOrder) =>
    set({ sortBy, sortOrder }),

  openCompleteModal: (purchase) =>
    set({ completePurchaseTarget: purchase }),

  closeCompleteModal: () =>
    set({ completePurchaseTarget: null }),

  openDeleteModal: (purchase) =>
    set({ deletePurchaseTarget: purchase }),

  closeDeleteModal: () =>
    set({ deletePurchaseTarget: null }),

  setActionFeedback: (actionFeedback) => {
    set({ actionFeedback });
    if (actionFeedback) {
      useFeedbackStore.getState().showSuccess(actionFeedback);
    }
  },

  setActionError: (actionError) => {
    set({ actionError });
    if (actionError) {
      useFeedbackStore.getState().showError(actionError);
    }
  },

  clearFeedback: () =>
    set({ actionFeedback: null }),

  clearActionError: () =>
    set({ actionError: null }),

  resetUIState: () =>
    set({
      searchTerm: '',
      statusFilter: 'ALL',
      currentPage: 1,
      completePurchaseTarget: null,
      deletePurchaseTarget: null,
      actionFeedback: null,
      actionError: null,
    }),
}));
