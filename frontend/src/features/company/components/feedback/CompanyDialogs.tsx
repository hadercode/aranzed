import { ConfirmDialog, SuccessDialog } from '@/shared/components/ui';
import { useCompanyContext } from '../../context';

export function CompanyDialogs() {
  const {
    isSuccessOpen,
    successMessage,
    closeSuccess,
    isConfirmDiscardOpen,
    setIsConfirmDiscardOpen,
    handleResetChanges,
    isSaving,
  } = useCompanyContext();

  return (
    <>
      {/* Confirm Discard Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDiscardOpen}
        title="¿Descartar cambios no guardados?"
        message="Tienes modificaciones sin guardar en los datos de la empresa. Si descartas, se revertirán a los valores actuales del servidor."
        confirmText="Descartar Cambios"
        cancelText="Permanecer aquí"
        variant="warning"
        loading={isSaving}
        onConfirm={handleResetChanges}
        onClose={() => setIsConfirmDiscardOpen(false)}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Datos Actualizados!"
        message={successMessage}
        buttonText="Aceptar"
        onClose={closeSuccess}
      />
    </>
  );
}

export default CompanyDialogs;
