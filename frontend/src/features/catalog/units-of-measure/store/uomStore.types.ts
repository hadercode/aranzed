import type {
  UnitOfMeasure,
  UomFormData,
  UomStatusFilter,
  UomDecimalsFilter,
} from '../types';

export const INITIAL_UOM_FORM_DATA: UomFormData = {
  code: '',
  name: '',
  isActive: true,
  allowDecimals: true,
};

export interface UnitsOfMeasureState {
  searchTerm: string;
  statusFilter: UomStatusFilter;
  decimalsFilter: UomDecimalsFilter;
  currentPage: number;
  itemsPerPage: number;
  isFormModalOpen: boolean;
  editingUom: UnitOfMeasure | null;
  formData: UomFormData;
  formErrors: Record<string, string>;
  isDeleteConfirmOpen: boolean;
  uomToDelete: UnitOfMeasure | null;
  isSuccessOpen: boolean;
  successMessage: string;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: UomStatusFilter) => void;
  setDecimalsFilter: (decimals: UomDecimalsFilter) => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  resetFilters: () => void;
  setFormData: (updater: Partial<UomFormData> | ((prev: UomFormData) => UomFormData)) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: (field?: string) => void;
  openCreateModal: () => void;
  openEditModal: (uom: UnitOfMeasure) => void;
  closeFormModal: () => void;
  openDeleteConfirm: (uom: UnitOfMeasure) => void;
  closeDeleteConfirm: () => void;
  showSuccess: (message: string) => void;
  closeSuccessDialog: () => void;
  resetUIState: () => void;
}

