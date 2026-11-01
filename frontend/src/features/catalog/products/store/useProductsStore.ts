import { create } from 'zustand';
import { initialProductsState, type ProductsState } from './productsStore.types';

export type { ProductsState } from './productsStore.types';

export const useProductsStore = create<ProductsState>((set) => ({
  ...initialProductsState,

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
      ...initialProductsState,
    }),
}));
