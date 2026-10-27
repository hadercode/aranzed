import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useCategoriesContext } from '../../context';

export function CategoriesDialogs() {
  const {
    isDeleteConfirmOpen,
    categoryToDelete,
    isMutating,
    handleCloseDelete,
    handleConfirmDelete,
    isSuccessOpen,
    successMessage,
    handleCloseSuccess,
  } = useCategoriesContext();

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Categoría"
        message={
          <span>
            ¿Estás seguro de que deseas eliminar la categoría{' '}
            <strong className="text-[var(--color-text-primary)]">
              &quot;{categoryToDelete?.name}&quot;
            </strong>
            ? Esta acción desvinculará sus subcategorías asociadas.
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

export default CategoriesDialogs;
