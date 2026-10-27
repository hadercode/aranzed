import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useProductsContext } from '../../context';

export function ProductsDialogs() {
  const {
    isDeleteConfirmOpen,
    productToDelete,
    isMutating,
    closeDeleteConfirm,
    handleDeleteProduct,
    isSuccessOpen,
    successMessage,
    closeSuccessDialog,
  } = useProductsContext();

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Producto"
        message={
          <span>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong className="text-[var(--color-text-primary)]">
              &quot;{productToDelete?.name}&quot;
            </strong>
            ? Esta acción es irreversible.
          </span>
        }
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={isMutating}
        onConfirm={handleDeleteProduct}
        onClose={closeDeleteConfirm}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Entendido"
        autoCloseMs={3500}
        onClose={closeSuccessDialog}
      />
    </>
  );
}

export default ProductsDialogs;
