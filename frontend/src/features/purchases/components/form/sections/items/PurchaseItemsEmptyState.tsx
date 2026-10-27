import { Layers, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { usePurchaseFormContext } from '../../../../context';

export function PurchaseItemsEmptyState() {
  const { formItems } = usePurchaseFormContext();
  const { handleAddNewItem } = formItems;

  return (
    <div className="py-12 border-2 border-dashed border-[var(--color-border)] rounded-2xl text-center bg-[var(--color-surface-bg)]/50">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <Layers className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
        Sin materiales agregados
      </h4>
      <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto mb-4">
        La compra debe contener al menos una materia prima o insumo con su respectivo costo y tratamiento de IVA.
      </p>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => handleAddNewItem()}
        leftIcon={<Plus className="w-3.5 h-3.5" />}
      >
        Agregar Primer Material
      </Button>
    </div>
  );
}

export default PurchaseItemsEmptyState;
