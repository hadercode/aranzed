import { AlertCircle } from 'lucide-react';
import { SuccessDialog } from '@/shared/components/ui/SuccessDialog';
import { useSalesFormContext } from '../../../context';

export function SaleFormFeedback() {
  const { isSuccessOpen, successMessage, handleCloseSuccess, mutationError } =
    useSalesFormContext();

  return (
    <>
      {/* Alerta de Error de Mutación */}
      {mutationError && (
        <div className="fixed bottom-24 right-6 max-w-md bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="text-xs">
            <strong className="block font-semibold mb-0.5">Error al procesar:</strong>
            <span>{mutationError}</span>
          </div>
        </div>
      )}

      {/* Diálogo de Éxito con redirección */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Comprobante Procesado!"
        message={successMessage}
        buttonText="Ir al Listado de Ventas"
        onClose={handleCloseSuccess}
      />
    </>
  );
}

export default SaleFormFeedback;
