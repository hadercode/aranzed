import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useRecipesContext } from '../../context';

export function RecipesDialogs() {
  const {
    isDeleteOpen,
    setIsDeleteOpen,
    deletingRecipe,
    handleConfirmDelete,
    actionError,
    isSuccessOpen,
    setIsSuccessOpen,
    successMessage,
    isMutating,
  } = useRecipesContext();

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteOpen && !!deletingRecipe}
        title="Eliminar Receta de Fabricación"
        message={
          <div className="space-y-3">
            <p>
              ¿Estás seguro de que deseas eliminar la receta{' '}
              <strong className="text-[var(--color-text-primary)] font-semibold">
                &quot;{deletingRecipe?.name}&quot;
              </strong>{' '}
              ({deletingRecipe?.code})?
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Esta acción desactivará la receta del catálogo.
            </p>
            {actionError && (
              <div className="alert-danger p-3 rounded-xl text-xs font-medium">
                {actionError}
              </div>
            )}
          </div>
        }
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isMutating}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />

      {/* Success Modal */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Aceptar"
        autoCloseMs={3500}
        onClose={() => setIsSuccessOpen(false)}
      />
    </>
  );
}

export default RecipesDialogs;

