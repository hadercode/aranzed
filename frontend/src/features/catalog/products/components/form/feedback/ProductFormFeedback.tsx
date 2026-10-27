import { AlertCircle } from 'lucide-react';
import { SuccessDialog } from '@/shared/components/ui';
import { useProductFormContext } from '../../../context';

export function ProductFormFeedback() {
  const {
    isSuccessOpen,
    successMessage,
    closeSuccessDialog,
    mutationError,
    clearMutationError,
  } = useProductFormContext();

  return (
    <>
      {/* Mutation Error Alert Banner */}
      {mutationError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{mutationError}</span>
          </div>
          <button
            type="button"
            onClick={clearMutationError}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Ir al Catálogo"
        autoCloseMs={2500}
        onClose={closeSuccessDialog}
      />
    </>
  );
}

export default ProductFormFeedback;
