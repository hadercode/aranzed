import { ShoppingBag, Plus, AlertCircle } from 'lucide-react';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { Button } from '@/shared/components/ui/Button';
import { useSalesFormContext } from '../../../context';
import { SaleItemsEmptyState, SaleItemsTable } from './items';

export function SaleItemsSection() {
  const { form } = useSalesFormContext();
  const {
    itemsFields,
    appendItem,
    formState: { errors },
  } = form;

  const itemsErrorMessage =
    errors.items && typeof errors.items.message === 'string'
      ? errors.items.message
      : null;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)] space-y-5">
      <SectionHeader
        icon={<ShoppingBag className="w-4 h-4" />}
        title="Detalle de Productos y Servicios Vendidos"
        description="Agrega artículos del catálogo, ajusta precios, descuentos porcentuales y tratamiento de impuestos"
        action={{
          label: 'Agregar Producto',
          onClick: () => appendItem(),
          icon: <Plus className="w-3.5 h-3.5" />,
          variant: 'outline',
          size: 'sm',
        }}
      />

      {itemsErrorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{itemsErrorMessage}</span>
        </div>
      )}

      {itemsFields.length === 0 ? (
        <SaleItemsEmptyState onAddItem={() => appendItem()} />
      ) : (
        <div className="space-y-3">
          <SaleItemsTable />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[var(--color-text-muted)]">
              {itemsFields.length} {itemsFields.length === 1 ? 'artículo en detalle' : 'artículos en detalle'}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendItem()}
              leftIcon={<Plus className="w-4 h-4 text-emerald-600" />}
              className="text-xs font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
            >
              Agregar otra línea
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaleItemsSection;
