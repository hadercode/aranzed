import { create } from 'zustand';
import type { Recipe, RecipeStatus } from '../types';

export interface RecipesState {
  // Filters & Search
  searchTerm: string;
  statusFilter: RecipeStatus | 'ALL';
  productFilter: string;

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  // Modals & Action Targets
  isDeleteConfirmOpen: boolean;
  recipeToDelete: Recipe | null;

  // Feedback Dialog
  isSuccessOpen: boolean;
  successMessage: string;

  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: RecipeStatus | 'ALL') => void;
  setProductFilter: (productId: string) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  resetFilters: () => void;

  openDeleteConfirm: (recipe: Recipe) => void;
  closeDeleteConfirm: () => void;

  showSuccess: (message: string) => void;
  closeSuccessDialog: () => void;

  resetUIState: () => void;
}

export const useRecipesStore = create<RecipesState>((set) => ({
  searchTerm: '',
  statusFilter: 'ALL',
  productFilter: '',

  currentPage: 1,
  itemsPerPage: 10,

  isDeleteConfirmOpen: false,
  recipeToDelete: null,

  isSuccessOpen: false,
  successMessage: '',

  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setProductFilter: (productFilter) => set({ productFilter, currentPage: 1 }),
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  resetFilters: () =>
    set({
      searchTerm: '',
      statusFilter: 'ALL',
      productFilter: '',
      currentPage: 1,
    }),

  openDeleteConfirm: (recipeToDelete) =>
    set({ isDeleteConfirmOpen: true, recipeToDelete }),
  closeDeleteConfirm: () => set({ isDeleteConfirmOpen: false, recipeToDelete: null }),

  showSuccess: (successMessage) => set({ isSuccessOpen: true, successMessage }),
  closeSuccessDialog: () => set({ isSuccessOpen: false, successMessage: '' }),

  resetUIState: () =>
    set({
      searchTerm: '',
      statusFilter: 'ALL',
      productFilter: '',
      currentPage: 1,
      isDeleteConfirmOpen: false,
      recipeToDelete: null,
      isSuccessOpen: false,
      successMessage: '',
    }),
}));

