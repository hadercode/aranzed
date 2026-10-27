import { ConfirmDialog, SuccessDialog } from "@/shared/components/ui";
import { usePermissionsContext } from "../../context";

export function PermissionsDialogs() {
  const {
    isSuccessOpen,
    successMessage,
    closeSuccess,
    isConfirmDiscardOpen,
    confirmDiscardAndSwitch,
    cancelDiscardRoleSwitch,
  } = usePermissionsContext();

  return (
    <>
      {/* Discard Unsaved Changes Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDiscardOpen}
        title="¿Descartar cambios no guardados?"
        message={
          <span>
            Tienes modificaciones no guardadas en los permisos del rol actual.
            Si cambias de rol sin guardar, todos los cambios pendientes se perderán.
          </span>
        }
        confirmText="Descartar y Cambiar"
        cancelText="Permanecer aquí"
        variant="warning"
        onConfirm={confirmDiscardAndSwitch}
        onClose={cancelDiscardRoleSwitch}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Permisos Guardados!"
        message={successMessage}
        buttonText="Aceptar"
        onClose={closeSuccess}
      />
    </>
  );
}

export default PermissionsDialogs;
