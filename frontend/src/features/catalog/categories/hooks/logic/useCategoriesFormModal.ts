import { useState, useCallback } from 'react';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { categorySchema } from '../../schemas/category.schema';
import { useEligibleParentCategories } from './useEligibleParentCategories';
import type {
  Category,
  CategoryFormData,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../types';

const INITIAL_FORM_DATA: CategoryFormData = {
  name: '',
  parentId: '',
  isActive: true,
};

export interface UseCategoriesFormModalProps {
  categories: Category[];
  createCategory: (dto: CreateCategoryDto) => Promise<Category>;
  updateCategory: (id: string, dto: UpdateCategoryDto) => Promise<Category>;
  clearMutationError: () => void;
  onSuccess: (message: string) => void;
}

export function useCategoriesFormModal({
  categories,
  createCategory,
  updateCategory,
  clearMutationError,
  onSuccess,
}: UseCategoriesFormModalProps) {
  const store = useCategoriesStore();
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const eligibleParentOptions = useEligibleParentCategories(categories, store.editingCategory);

  const handleOpenCreate = useCallback(() => {
    clearMutationError();
    store.openCreateModal();
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, [clearMutationError, store]);

  const handleOpenEdit = useCallback(
    (category: Category) => {
      clearMutationError();
      store.openEditModal(category);
      setFormData({
        id: category.id,
        name: category.name,
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
      setFormErrors({});
    },
    [clearMutationError, store]
  );

  const handleCloseForm = useCallback(() => {
    store.closeFormModal();
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, [store]);

  const handleFormChange = useCallback(
    (field: keyof CategoryFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
      const result = categorySchema.safeParse(formData);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) errors[String(err.path[0])] = err.message;
        });
        setFormErrors(errors);
        return;
      }

      try {
        const trimmedName = result.data.name;
        const payloadParentId = result.data.parentId || undefined;

        if (store.editingCategory) {
          await updateCategory(store.editingCategory.id, {
            name: trimmedName,
            parentId: payloadParentId,
            isActive: result.data.isActive,
          });
          onSuccess(`Categoría "${trimmedName}" actualizada.`);
        } else {
          await createCategory({
            name: trimmedName,
            parentId: payloadParentId,
            isActive: result.data.isActive,
          });
          onSuccess(`Categoría "${trimmedName}" creada con éxito.`);
        }
        store.closeFormModal();
      } catch {
        // Handled in mutation hook
      }
    },
    [formData, store, updateCategory, createCategory, onSuccess]
  );

  return {
    isFormModalOpen: store.isFormModalOpen,
    editingCategory: store.editingCategory,
    formData,
    formErrors,
    eligibleParentOptions,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleFormSubmit,
  };
}
