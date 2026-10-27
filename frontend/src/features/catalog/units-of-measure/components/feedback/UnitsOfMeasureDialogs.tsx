import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useUnitsOfMeasureContext } from '../../context';

export function UnitsOfMeasureDialogs() {
  const {
    isDeleteConfirmOpen,
    uomToDelete,
    isMutating,
    handleCloseDelete,
    handleConfirmDelete,
    isSuccessOpen,
    successMessage,
    handleCloseSuccess,
  } = useUnitsOfMeasureContext();

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Unidad de Medida"
        message={
          <span>
            ¿Estás seguro de que deseas eliminar la unidad de medida{' '}
            <strong className="text-[var(--color-text-primary)]">
              &quot;{uomToDelete?.name} ({uomToDelete?.code})&quot;
            </strong>
            ? Esta acción es irreversible.
          </span>
        }
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isMutating}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDelete}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Entendido"
        autoCloseMs={3500}
        onClose={handleCloseSuccess}
      />
    </>
  );
}

export default UnitsOfMeasureDialogs;
