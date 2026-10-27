import { Save } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import { useCategoriesContext } from '../../context';

export function CategoryFormModal() {
  const {
    isFormModalOpen,
    editingCategory,
    formData,
    formErrors,
    eligibleParentOptions,
    isMutating,
    mutationError,
    handleCloseForm,
    handleFormChange,
    handleFormSubmit,
  } = useCategoriesContext();

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={handleCloseForm}
      title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {mutationError && (
          <div className="p-3 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {mutationError}
          </div>
        )}

        {/* Category Name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Nombre de la Categoría <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            placeholder="Ej. Computación, Calzado, Bebidas..."
            maxLength={100}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
              formErrors.name
                ? 'border-rose-500 focus:ring-rose-500/30'
                : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
            }`}
          />
          {formErrors.name && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.name}</p>
          )}
        </div>

        {/* Parent Category Selector */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Categoría Padre (Opcional)
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => handleFormChange('parentId', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
          >
            <option value="">Ninguna — Categoría Principal (Raíz)</option>
            {eligibleParentOptions.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.path || parent.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Si seleccionas una categoría padre, se registrará como subcategoría en el árbol.
          </p>
        </div>

        {/* Active Toggle Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleFormChange('isActive', e.target.checked)}
              className="mt-0.5 rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                Categoría Activa
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Las categorías activas se pueden asignar a productos en el inventario y catálogo.
              </div>
            </div>
          </label>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseForm}
            disabled={isMutating}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isMutating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryFormModal;
