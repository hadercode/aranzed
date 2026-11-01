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

export const initialProductsState = {
  searchTerm: '',
  typeFilter: 'all' as ProductTypeFilter,
  statusFilter: 'all' as ProductStatusFilter,
  categoryFilter: 'all',
  uomFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  sortBy: null as string | null,
  sortOrder: null as 'asc' | 'desc' | null,
  isFormModalOpen: false,
  editingProduct: null as Product | null,
  isBulkImportOpen: false,
  isDeleteConfirmOpen: false,
  productToDelete: null as Product | null,
  isSuccessOpen: false,
  successMessage: '',
};

