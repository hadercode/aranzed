import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { usePurchaseFormContext } from '../../../context';

export function PurchaseFormLoadingState() {
  return (
    <div className="max-w-5xl mx-auto py-24 text-center">
      <div className="inline-block animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-4" />
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Cargando formulario de compra...
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
        Obteniendo catálogo de materiales e insumos
      </p>
    </div>
  );
}

export function PurchaseFormErrorState() {
  const { loadError, refetchInitial, handleCancel } = usePurchaseFormContext();

  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
        Error al cargar los datos
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        {loadError || 'Ocurrió un error inesperado al conectar con el servidor.'}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleCancel}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <Button
          variant="primary"
          onClick={refetchInitial}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Reintentar
        </Button>
      </div>
    </div>
  );
}
