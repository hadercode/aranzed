import { create } from 'zustand';
import type {
  Product,
  ProductTypeFilter,
  ProductStatusFilter,
} from '../types';

export interface ProductsState {
  // Filters & Search
  searchTerm: string;
  typeFilter: ProductTypeFilter;
  statusFilter: ProductStatusFilter;
  categoryFilter: string;
  uomFilter: string;

  // Sorting & Pagination
  currentPage: number;
  itemsPerPage: number;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;

  // Modals & Action Targets
  isFormModalOpen: boolean;
  editingProduct: Product | null;
  isBulkImportOpen: boolean;
  isDeleteConfirmOpen: boolean;
  productToDelete: Product | null;

  // Feedback Dialog
  isSuccessOpen: boolean;
  successMessage: string;

  // Actions
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: ProductTypeFilter) => void;
  setStatusFilter: (status: ProductStatusFilter) => void;
  setCategoryFilter: (categoryId: string) => void;
  setUomFilter: (uomId: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSort: (sortBy: string | null, sortOrder: 'asc' | 'desc' | null) => void;
  resetFilters: () => void;

  openCreateModal: () => void;
  openEditModal: (product: Product) => void;
  closeFormModal: () => void;

  openBulkImportModal: () => void;
  closeBulkImportModal: () => void;

  openDeleteConfirm: (product: Product) => void;
  closeDeleteConfirm: () => void;

  showSuccess: (message: string) => void;
  closeSuccessDialog: () => void;

  resetUIState: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  searchTerm: '',
  typeFilter: 'all',
  statusFilter: 'all',
  categoryFilter: 'all',
  uomFilter: 'all',

  currentPage: 1,
  itemsPerPage: 10,
  sortBy: null,
  sortOrder: null,

  isFormModalOpen: false,
  editingProduct: null,
  isBulkImportOpen: false,
  isDeleteConfirmOpen: false,
  productToDelete: null,

  isSuccessOpen: false,
  successMessage: '',

  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setTypeFilter: (typeFilter) => set({ typeFilter, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter, currentPage: 1 }),
  setUomFilter: (uomFilter) => set({ uomFilter, currentPage: 1 }),

  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),

  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),

  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, currentPage: 1 }),

  resetFilters: () =>
    set({
      searchTerm: '',
      typeFilter: 'all',
      statusFilter: 'all',
      categoryFilter: 'all',
      uomFilter: 'all',
      currentPage: 1,
    }),

  openCreateModal: () =>
    set({
      editingProduct: null,
      isFormModalOpen: true,
    }),

  openEditModal: (product) =>
    set({
      editingProduct: product,
      isFormModalOpen: true,
    }),

  closeFormModal: () =>
    set({
      isFormModalOpen: false,
      editingProduct: null,
    }),

  openBulkImportModal: () => set({ isBulkImportOpen: true }),
  closeBulkImportModal: () => set({ isBulkImportOpen: false }),

  openDeleteConfirm: (product) =>
    set({
      productToDelete: product,
      isDeleteConfirmOpen: true,
    }),

  closeDeleteConfirm: () =>
    set({
      productToDelete: null,
      isDeleteConfirmOpen: false,
    }),

  showSuccess: (successMessage) =>
    set({
      successMessage,
      isSuccessOpen: true,
    }),

  closeSuccessDialog: () =>
    set({
      successMessage: '',
      isSuccessOpen: false,
    }),

  resetUIState: () =>
    set({
      searchTerm: '',
      typeFilter: 'all',
      statusFilter: 'all',
      categoryFilter: 'all',
      uomFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      sortBy: null,
      sortOrder: null,
      isFormModalOpen: false,
      editingProduct: null,
      isBulkImportOpen: false,
      isDeleteConfirmOpen: false,
      productToDelete: null,
      isSuccessOpen: false,
      successMessage: '',
    }),
}));

