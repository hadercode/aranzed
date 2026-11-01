import { create } from 'zustand';
import {
  INITIAL_UOM_FORM_DATA,
  type UnitsOfMeasureState,
} from './uomStore.types';

export * from './uomStore.types';

export const useUnitsOfMeasureStore = create<UnitsOfMeasureState>((set) => ({
  searchTerm: '',
  statusFilter: 'all',
  decimalsFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  isFormModalOpen: false,
  editingUom: null,
  formData: INITIAL_UOM_FORM_DATA,
  formErrors: {},
  isDeleteConfirmOpen: false,
  uomToDelete: null,
  isSuccessOpen: false,
  successMessage: '',

  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setDecimalsFilter: (decimalsFilter) => set({ decimalsFilter, currentPage: 1 }),
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === 'function' ? page(state.currentPage) : page,
    })),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage, currentPage: 1 }),
  resetFilters: () =>
    set({
      searchTerm: '',
      statusFilter: 'all',
      decimalsFilter: 'all',
      currentPage: 1,
    }),

  setFormData: (updater) =>
    set((state) => ({
      formData: typeof updater === 'function' ? updater(state.formData) : { ...state.formData, ...updater },
    })),
  setFormErrors: (formErrors) => set({ formErrors }),
  clearFormErrors: (field) =>
    set((state) => {
      if (!field) return { formErrors: {} };
      const next = { ...state.formErrors };
      delete next[field];
      return { formErrors: next };
    }),

  openCreateModal: () =>
    set({
      isFormModalOpen: true,
      editingUom: null,
      formData: INITIAL_UOM_FORM_DATA,
      formErrors: {},
    }),
  openEditModal: (editingUom) =>
    set({
      isFormModalOpen: true,
      editingUom,
      formData: {
        id: editingUom.id,
        code: editingUom.code,
        name: editingUom.name,
        isActive: editingUom.isActive,
        allowDecimals: editingUom.allowDecimals,
      },
      formErrors: {},
    }),
  closeFormModal: () =>
    set({
      isFormModalOpen: false,
      editingUom: null,
      formData: INITIAL_UOM_FORM_DATA,
      formErrors: {},
    }),

  openDeleteConfirm: (uomToDelete) =>
    set({ isDeleteConfirmOpen: true, uomToDelete }),
  closeDeleteConfirm: () => set({ isDeleteConfirmOpen: false, uomToDelete: null }),

  showSuccess: (successMessage) => set({ isSuccessOpen: true, successMessage }),
  closeSuccessDialog: () => set({ isSuccessOpen: false, successMessage: '' }),

  resetUIState: () =>
    set({
      searchTerm: '',
      statusFilter: 'all',
      decimalsFilter: 'all',
      currentPage: 1,
      isFormModalOpen: false,
      editingUom: null,
      formData: INITIAL_UOM_FORM_DATA,
      formErrors: {},
      isDeleteConfirmOpen: false,
      uomToDelete: null,
      isSuccessOpen: false,
      successMessage: '',
    }),
}));
