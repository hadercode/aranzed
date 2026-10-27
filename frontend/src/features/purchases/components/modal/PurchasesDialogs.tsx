import { ConfirmDialog } from '@/shared/components/ui';
import { usePurchasesContext } from '../../context';

export function PurchasesDialogs() {
  const {
    completePurchaseTarget,
    closeCompleteModal,
    handleConfirmComplete,
    deletePurchaseTarget,
    closeDeleteModal,
    handleConfirmDelete,
    isMutating,
  } = usePurchasesContext();

  return (
    <>
      {/* Diálogo para Aprobar / Completar compra y emitir evento de inventario */}
      <ConfirmDialog
        isOpen={Boolean(completePurchaseTarget)}
        title="¿Completar compra de materiales?"
        message={`Esta acción marcará la compra #${completePurchaseTarget?.purchaseNumber} (Factura: ${completePurchaseTarget?.invoiceNumber}) como COMPLETADA. Al confirmar, el sistema emitirá el evento de dominio desacoplado que dará ingreso al stock de inventario para todos los materiales comprados.`}
        confirmText="Completar y Emitir Evento"
        cancelText="Volver"
        variant="info"
        loading={isMutating}
        onConfirm={handleConfirmComplete}
        onClose={closeCompleteModal}
      />

      {/* Diálogo para Eliminar Borrador */}
      <ConfirmDialog
        isOpen={Boolean(deletePurchaseTarget)}
        title="¿Eliminar compra en borrador?"
        message={`¿Estás seguro de que deseas eliminar el borrador de compra #${deletePurchaseTarget?.purchaseNumber}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Borrador"
        cancelText="Cancelar"
        variant="danger"
        loading={isMutating}
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
      />
    </>
  );
}

export default PurchasesDialogs;
