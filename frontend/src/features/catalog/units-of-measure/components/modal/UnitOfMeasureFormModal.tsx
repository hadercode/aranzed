import { Save } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import { useUnitsOfMeasureContext } from '../../context';

export function UnitOfMeasureFormModal() {
  const {
    isFormModalOpen,
    editingUom,
    formData,
    formErrors,
    isMutating,
    mutationError,
    handleCloseForm,
    handleFormChange,
    handleFormSubmit,
  } = useUnitsOfMeasureContext();

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={handleCloseForm}
      title={editingUom ? 'Editar Unidad de Medida' : 'Nueva Unidad de Medida'}
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {mutationError && (
          <div className="p-3 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {mutationError}
          </div>
        )}

        {/* Code Input */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Código de la Unidad <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleFormChange('code', e.target.value)}
            placeholder="Ej. KG, LT, UND, MTR..."
            maxLength={10}
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wider border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
              formErrors.code
                ? 'border-rose-500 focus:ring-rose-500/30'
                : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
            }`}
          />
          {formErrors.code ? (
            <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.code}</p>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Máximo 10 caracteres alfanuméricos. Se guardará en mayúsculas.
            </p>
          )}
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Nombre Descriptivo <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            placeholder="Ej. Kilogramo, Litro, Metro Lineal, Unidad..."
            maxLength={50}
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

        {/* Allow Decimals Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
            <input
              type="checkbox"
              checked={formData.allowDecimals}
              onChange={(e) => handleFormChange('allowDecimals', e.target.checked)}
              className="mt-0.5 rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                Permitir Cantidades Decimales
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Permite registrar productos en cantidades fraccionadas (ej: 0.50 kg, 1.25 m). Si se desactiva, solo se admitirán cantidades enteras (1, 2, 3).
              </div>
            </div>
          </label>
        </div>

        {/* Active Toggle Checkbox */}
        <div>
          <label className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleFormChange('isActive', e.target.checked)}
              className="mt-0.5 rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                Unidad Activa
              </div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Las unidades activas están disponibles para la creación y edición de productos en el catálogo.
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
            {editingUom ? 'Guardar Cambios' : 'Crear Unidad'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UnitOfMeasureFormModal;
