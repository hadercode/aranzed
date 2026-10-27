import { RefreshCw, AlertCircle, ArrowLeft, ScrollText } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useRecipeFormContext } from '../../../context';

export function RecipeFormLoadingState() {
  return (
    <div className="max-w-7xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] flex items-center justify-center mx-auto mb-2 animate-pulse">
        <ScrollText className="w-7 h-7" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          Cargando datos de la receta...
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Obteniendo insumos, lista de materiales y fórmulas asociadas
        </p>
      </div>
    </div>
  );
}

export function RecipeFormErrorState() {
  const { loadError, refetchInitial, handleCancel } = useRecipeFormContext();

  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
        Error al cargar la receta
      </h3>
      <p className="text-sm text-rose-600 dark:text-rose-400 font-medium max-w-md mx-auto">
        {loadError || 'No se pudieron recuperar los datos necesarios del servidor.'}
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => void refetchInitial()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Reintentar
        </Button>
      </div>
    </div>
  );
}
