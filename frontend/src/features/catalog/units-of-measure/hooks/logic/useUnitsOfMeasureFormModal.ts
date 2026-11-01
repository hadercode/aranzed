import { useCallback } from 'react';
import { useUnitsOfMeasureStore } from '../../store/useUnitsOfMeasureStore';
import { unitOfMeasureSchema } from '../../schemas/unit-of-measure.schema';
import type {
  UnitOfMeasure,
  UomFormData,
  CreateUomDto,
  UpdateUomDto,
} from '../../types';

interface UseUnitsOfMeasureFormModalProps {
  createUom: (dto: CreateUomDto) => Promise<UnitOfMeasure>;
  updateUom: (id: string, dto: UpdateUomDto) => Promise<UnitOfMeasure>;
  clearMutationError: () => void;
}

export function useUnitsOfMeasureFormModal({
  createUom,
  updateUom,
  clearMutationError,
}: UseUnitsOfMeasureFormModalProps) {
  const store = useUnitsOfMeasureStore();

  const handleOpenCreate = useCallback(() => {
    clearMutationError();
    store.openCreateModal();
  }, [clearMutationError, store]);

  const handleOpenEdit = useCallback(
    (uom: UnitOfMeasure) => {
      clearMutationError();
      store.openEditModal(uom);
    },
    [clearMutationError, store]
  );

  const handleCloseForm = useCallback(() => {
    store.closeFormModal();
  }, [store]);

  const handleFormChange = useCallback(
    (field: keyof UomFormData, value: string | boolean) => {
      let finalValue = value;
      if (field === 'code' && typeof value === 'string') {
        finalValue = value.toUpperCase();
      }
      store.setFormData((prev) => ({ ...prev, [field]: finalValue }));
      store.clearFormErrors(field);
    },
    [store]
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const validation = unitOfMeasureSchema.safeParse(store.formData);

      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          if (err.path[0]) errors[String(err.path[0])] = err.message;
        });
        store.setFormErrors(errors);
        return;
      }

      try {
        const trimmedCode = validation.data.code;
        const trimmedName = validation.data.name;

        if (store.editingUom) {
          await updateUom(store.editingUom.id, {
            code: trimmedCode,
            name: trimmedName,
            isActive: store.formData.isActive,
            allowDecimals: store.formData.allowDecimals,
          });
          store.showSuccess(`Unidad de medida "${trimmedCode} - ${trimmedName}" actualizada.`);
        } else {
          await createUom({
            code: trimmedCode,
            name: trimmedName,
            isActive: store.formData.isActive,
            allowDecimals: store.formData.allowDecimals,
          });
          store.showSuccess(`Unidad de medida "${trimmedCode} - ${trimmedName}" creada con éxito.`);
        }
        store.closeFormModal();
      } catch {
        // Handled in mutation hook
      }
    },
    [store, updateUom, createUom]
  );

  return {
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleFormSubmit,
  };
}
