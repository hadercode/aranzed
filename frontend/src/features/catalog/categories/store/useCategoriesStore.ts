import { create } from 'zustand';
import type { Category, CategoryStatusFilter } from '../types';

export interface CategoriesState {
  // Filters & Search
  searchTerm: string;
  statusFilter: CategoryStatusFilter;
  parentFilter: string;

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Modals & Action Targets
  isFormModalOpen: boolean;
  editingCategory: Category | null;

  isDeleteConfirmOpen: boolean;
  categoryToDelete: Category | null;

  // Feedback Dialog
  isSuccessOpen: boolean;
  successMessage: string;

  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: CategoryStatusFilter) => void;
  setParentFilter: (parentId: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  resetFilters: () => void;

  openCreateModal: () => void;
  openEditModal: (category: Category) => void;
  closeFormModal: () => void;

  openDeleteConfirm: (category: Category) => void;
  closeDeleteConfirm: () => void;

  showSuccess: (message: string) => void;
  closeSuccessDialog: () => void;

  resetUIState: () => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  searchTerm: '',
  statusFilter: 'all',
  parentFilter: 'all',

  currentPage: 1,
  itemsPerPage: 10,

  isFormModalOpen: false,
  editingCategory: null,

  isDeleteConfirmOpen: false,
  categoryToDelete: null,

  isSuccessOpen: false,
  successMessage: '',

  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setParentFilter: (parentFilter) => set({ parentFilter, currentPage: 1 }),
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  resetFilters: () =>
    set({
      searchTerm: '',
      statusFilter: 'all',
      parentFilter: 'all',
      currentPage: 1,
    }),

  openCreateModal: () => set({ isFormModalOpen: true, editingCategory: null }),
  openEditModal: (editingCategory) => set({ isFormModalOpen: true, editingCategory }),
  closeFormModal: () => set({ isFormModalOpen: false, editingCategory: null }),

  openDeleteConfirm: (categoryToDelete) =>
    set({ isDeleteConfirmOpen: true, categoryToDelete }),
  closeDeleteConfirm: () => set({ isDeleteConfirmOpen: false, categoryToDelete: null }),

  showSuccess: (successMessage) => set({ isSuccessOpen: true, successMessage }),
  closeSuccessDialog: () => set({ isSuccessOpen: false, successMessage: '' }),

  resetUIState: () =>
    set({
      searchTerm: '',
      statusFilter: 'all',
      parentFilter: 'all',
      currentPage: 1,
      isFormModalOpen: false,
      editingCategory: null,
      isDeleteConfirmOpen: false,
      categoryToDelete: null,
      isSuccessOpen: false,
      successMessage: '',
    }),
}));

