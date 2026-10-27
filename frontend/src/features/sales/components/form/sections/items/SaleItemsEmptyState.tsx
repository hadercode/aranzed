import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export interface SaleItemsEmptyStateProps {
  onAddItem: () => void;
}

export function SaleItemsEmptyState({ onAddItem }: SaleItemsEmptyStateProps) {
  return (
    <div className="p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-bg)]/40">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
        <ShoppingCart className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
        Sin productos agregados
      </h4>
      <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto mb-4">
        Agrega al menos un producto tradicional, elaborado o servicio para conformar el comprobante de venta o cotización.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onAddItem}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Agregar Primer Producto
      </Button>
    </div>
  );
}

export default SaleItemsEmptyState;
