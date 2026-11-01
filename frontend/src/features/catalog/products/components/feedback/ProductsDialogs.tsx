import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useProductsStore } from '../../store';
import {
  useProductsQuery,
  useProductsMutations,
  useProductsDialogs,
} from '../../hooks';
import { ProductsBulkImportModal } from '../modal/ProductsBulkImportModal';

export function ProductsDialogs() {
  const {
    isDeleteConfirmOpen,
    productToDelete,
    closeDeleteConfirm,
    isSuccessOpen,
    successMessage,
    closeSuccessDialog,
    isBulkImportOpen,
    closeBulkImportModal,
  } = useProductsStore();

  const { refetch } = useProductsQuery();
  const { deleteProduct, isMutating } = useProductsMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  const { handleDeleteProduct } = useProductsDialogs({ deleteProduct });

  return (
    <>
      {/* Modal de Carga Masiva de Artículos */}
      <ProductsBulkImportModal
        isOpen={isBulkImportOpen}
        onClose={closeBulkImportModal}
        onImportSuccess={() => {
          void refetch();
        }}
      />

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

      {/* Generic Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="Operación Exitosa"
        message={successMessage}
        buttonText="Entendido"
        onClose={closeSuccessDialog}
      />
    </>
  );
}

export default ProductsDialogs;
