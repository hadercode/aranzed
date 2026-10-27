import { useState, useMemo, useCallback } from 'react';
import { useUnitsOfMeasureQuery } from '../queries/useUnitsOfMeasureQuery';
import { useUnitsOfMeasureMutations } from '../mutations/useUnitsOfMeasureMutations';
import type {
  UnitOfMeasure,
  UomFormData,
  UomStats,
  UomStatusFilter,
  UomDecimalsFilter,
} from '../../types';

const INITIAL_FORM_DATA: UomFormData = {
  code: '',
  name: '',
  isActive: true,
  allowDecimals: true,
};

export function useUnitsOfMeasurePage() {
  const { data: uoms, loading, error: fetchError, refetch } = useUnitsOfMeasureQuery();

  // Dialog and Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Selected item targets
  const [editingUom, setEditingUom] = useState<UnitOfMeasure | null>(null);
  const [uomToDelete, setUomToDelete] = useState<UnitOfMeasure | null>(null);

  // Form state
  const [formData, setFormData] = useState<UomFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UomStatusFilter>('all');
  const [decimalsFilter, setDecimalsFilter] = useState<UomDecimalsFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    createUom,
    updateUom,
    deleteUom,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useUnitsOfMeasureMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  // Derived KPI Stats
  const stats = useMemo<UomStats>(() => {
    let active = 0;
    let inactive = 0;
    let allowDecimals = 0;
    let integersOnly = 0;

    for (const uom of uoms) {
      if (uom.isActive) {
        active++;
      } else {
        inactive++;
      }

      if (uom.allowDecimals) {
        allowDecimals++;
      } else {
        integersOnly++;
      }
    }

    return {
      total: uoms.length,
      active,
      inactive,
      allowDecimals,
      integersOnly,
    };
  }, [uoms]);

  // Filtered UoMs
  const filteredUoms = useMemo(() => {
    return uoms.filter((uom) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesCode = uom.code.toLowerCase().includes(query);
        const matchesName = uom.name.toLowerCase().includes(query);
        if (!matchesCode && !matchesName) return false;
      }

      // Status filter
      if (statusFilter === 'active' && !uom.isActive) return false;
      if (statusFilter === 'inactive' && uom.isActive) return false;

      // Decimals filter
      if (decimalsFilter === 'decimals' && !uom.allowDecimals) return false;
      if (decimalsFilter === 'integers' && uom.allowDecimals) return false;

      return true;
    });
  }, [uoms, searchTerm, statusFilter, decimalsFilter]);

  // Paginated list
  const paginatedUoms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUoms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUoms, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUoms.length / itemsPerPage));
  }, [filteredUoms.length, itemsPerPage]);

  // Handlers with automatic page reset on filter change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: UomStatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleDecimalsFilterChange = useCallback((value: UomDecimalsFilter) => {
    setDecimalsFilter(value);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setDecimalsFilter('all');
    setCurrentPage(1);
  }, []);

  // Modal open & close handlers
  const handleOpenCreate = useCallback(() => {
    clearMutationError();
    setEditingUom(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setIsFormModalOpen(true);
  }, [clearMutationError]);

  const handleOpenEdit = useCallback(
    (uom: UnitOfMeasure) => {
      clearMutationError();
      setEditingUom(uom);
      setFormData({
        id: uom.id,
        code: uom.code,
        name: uom.name,
        isActive: uom.isActive,
        allowDecimals: uom.allowDecimals,
      });
      setFormErrors({});
      setIsFormModalOpen(true);
    },
    [clearMutationError]
  );

  const handleCloseForm = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingUom(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, []);

  const handleFormChange = useCallback(
    (field: keyof UomFormData, value: string | boolean) => {
      let finalValue = value;
      if (field === 'code' && typeof value === 'string') {
        // Automatically uppercase code
        finalValue = value.toUpperCase();
      }
      setFormData((prev) => ({ ...prev, [field]: finalValue }));
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [formErrors]
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      const errors: Record<string, string> = {};
      const trimmedCode = formData.code.trim().toUpperCase();
      const trimmedName = formData.name.trim();

      if (!trimmedCode) {
        errors.code = 'El código de la unidad es obligatorio';
      } else if (trimmedCode.length > 10) {
        errors.code = 'El código no puede superar 10 caracteres';
      }

      if (!trimmedName) {
        errors.name = 'El nombre de la unidad es obligatorio';
      } else if (trimmedName.length > 50) {
        errors.name = 'El nombre no puede superar 50 caracteres';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      try {
        if (editingUom) {
          await updateUom(editingUom.id, {
            code: trimmedCode,
            name: trimmedName,
            isActive: formData.isActive,
            allowDecimals: formData.allowDecimals,
          });
          setSuccessMessage(`Unidad de medida "${trimmedCode} - ${trimmedName}" actualizada.`);
        } else {
          await createUom({
            code: trimmedCode,
            name: trimmedName,
            isActive: formData.isActive,
            allowDecimals: formData.allowDecimals,
          });
          setSuccessMessage(`Unidad de medida "${trimmedCode} - ${trimmedName}" creada con éxito.`);
        }

        setIsFormModalOpen(false);
        setIsSuccessOpen(true);
      } catch {
        // Handled in mutation hook
      }
    },
    [formData, editingUom, updateUom, createUom]
  );

  // Delete handlers
  const handleOpenDelete = useCallback((uom: UnitOfMeasure) => {
    setUomToDelete(uom);
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setUomToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!uomToDelete) return;
    try {
      await deleteUom(uomToDelete.id);
      setIsDeleteConfirmOpen(false);
      setSuccessMessage(`Unidad de medida "${uomToDelete.code}" eliminada correctamente.`);
      setUomToDelete(null);
      setIsSuccessOpen(true);
    } catch {
      // Handled in mutation hook
    }
  }, [uomToDelete, deleteUom]);

  const handleCloseSuccess = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  }, []);

  return {
    uoms,
    filteredUoms,
    paginatedUoms,
    stats,
    loading,
    fetchError,
    mutationError,
    isMutating,
    clearMutationError,
    refetch,

    // Filters & Pagination
    searchTerm,
    statusFilter,
    decimalsFilter,
    currentPage,
    itemsPerPage,
    totalPages,
    handleSearchChange,
    handleStatusFilterChange,
    handleDecimalsFilterChange,
    handleItemsPerPageChange,
    handleResetFilters,
    setCurrentPage,

    // Form Modal
    isFormModalOpen,
    editingUom,
    formData,
    formErrors,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleFormSubmit,

    // Delete confirmation
    isDeleteConfirmOpen,
    uomToDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,

    // Success feedback
    isSuccessOpen,
    successMessage,
    handleCloseSuccess,
  };
}

export type UseUnitsOfMeasurePageReturn = ReturnType<typeof useUnitsOfMeasurePage>;
