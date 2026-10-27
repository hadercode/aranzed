import { useState, useMemo, useCallback } from 'react';
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Eligible Parent Options when editing to avoid circular parenting
  const eligibleParentOptions = useMemo(() => {
    if (!editingCategory) {
      return categories.filter((c) => c.isActive);
    }

    // Exclude the category itself and any descendants
    const excludedIds = new Set<string>([editingCategory.id]);

    // Find all descendants recursively
    let added = true;
    while (added) {
      added = false;
      for (const cat of categories) {
        if (cat.parentId && excludedIds.has(cat.parentId) && !excludedIds.has(cat.id)) {
          excludedIds.add(cat.id);
          added = true;
        }
      }
    }

    return categories.filter((c) => !excludedIds.has(c.id));
  }, [categories, editingCategory]);

  const handleOpenCreate = useCallback(() => {
    clearMutationError();
    setEditingCategory(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setIsFormModalOpen(true);
  }, [clearMutationError]);

  const handleOpenEdit = useCallback(
    (category: Category) => {
      clearMutationError();
      setEditingCategory(category);
      setFormData({
        id: category.id,
        name: category.name,
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
      setFormErrors({});
      setIsFormModalOpen(true);
    },
    [clearMutationError]
  );

  const handleCloseForm = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingCategory(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, []);

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

      // Validation
      const errors: Record<string, string> = {};
      if (!formData.name.trim()) {
        errors.name = 'El nombre de la categoría es obligatorio';
      } else if (formData.name.length > 100) {
        errors.name = 'El nombre no puede exceder 100 caracteres';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      try {
        if (editingCategory) {
          await updateCategory(editingCategory.id, {
            name: formData.name.trim(),
            parentId: formData.parentId ? formData.parentId : null,
            isActive: formData.isActive,
          });
          onSuccess(`Categoría "${formData.name.trim()}" actualizada con éxito.`);
        } else {
          await createCategory({
            name: formData.name.trim(),
            parentId: formData.parentId ? formData.parentId : undefined,
            isActive: formData.isActive,
          });
          onSuccess(`Categoría "${formData.name.trim()}" creada con éxito.`);
        }

        setIsFormModalOpen(false);
      } catch {
        // Handled in mutation hook
      }
    },
    [formData, editingCategory, updateCategory, createCategory, onSuccess]
  );

  return {
    isFormModalOpen,
    editingCategory,
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
