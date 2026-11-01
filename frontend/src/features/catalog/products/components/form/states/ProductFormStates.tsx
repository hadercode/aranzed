import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui';

export interface ProductFormErrorStateProps {
  loadError?: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function ProductFormLoadingState() {
  return (
    <div className="max-w-8xl mx-auto py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Package className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
        Cargando formulario de producto...
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
        Obteniendo información del catálogo y unidades de medida.
      </p>
    </div>
  );
}

export function ProductFormErrorState({
  loadError,
  onCancel,
  onRetry,
}: ProductFormErrorStateProps) {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
        No se pudo cargar la información
      </h3>
      <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
        {loadError || 'Ocurrió un error inesperado al recuperar los datos del producto.'}
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver al Catálogo
          </Button>
        )}
        {onRetry && (
          <Button
            type="button"
            variant="primary"
            onClick={onRetry}
          >
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}
