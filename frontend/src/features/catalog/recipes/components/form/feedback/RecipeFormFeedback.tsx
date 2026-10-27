import { AlertCircle } from 'lucide-react';
import { SuccessDialog } from '@/shared/components/ui';
import { useRecipeFormContext } from '../../../context';

export function RecipeFormFeedback() {
  const {
    mutationError,
    clearMutationError,
    isSuccessOpen,
    successMessage,
    handleSuccessClose,
  } = useRecipeFormContext();

  return (
    <>
      {/* Error Banner */}
      {mutationError && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl alert-danger shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold">Error al procesar la receta</h4>
            <p className="text-xs opacity-90 leading-relaxed">{mutationError}</p>
          </div>
          <button
            type="button"
            onClick={clearMutationError}
            className="text-xs font-semibold underline hover:opacity-80 ml-2 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Success Modal */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Volver al Catálogo de Recetas"
        onClose={handleSuccessClose}
      />
    </>
  );
}

export default RecipeFormFeedback;

