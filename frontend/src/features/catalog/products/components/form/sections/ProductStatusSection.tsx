import { CheckCircle2, Sparkles } from 'lucide-react';
import { useProductFormContext } from '../../../context';

export function ProductStatusSection() {
  const { register, isEditing, product } = useProductFormContext();

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-sage-600)]" />
          6. Estado y Disponibilidad
        </span>
      </div>

      <div className="space-y-4">
        {/* Active Toggle */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <input
            type="checkbox"
            id="pageIsActive"
            {...register('isActive')}
            className="w-4 h-4 mt-0.5 rounded text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] cursor-pointer"
          />
          <label htmlFor="pageIsActive" className="text-xs cursor-pointer select-none">
            <strong className="text-sm font-bold text-[var(--color-text-primary)] block">
              Producto Activo para Venta
            </strong>
            <span className="text-[var(--color-text-secondary)]">
              Permite que el producto aparezca en catálogos de venta, pedidos y comprobantes.
            </span>
          </label>
        </div>

        {/* Manage Inventory Toggle */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <input
            type="checkbox"
            id="pageManageInventory"
            {...register('manageInventory')}
            className="w-4 h-4 mt-0.5 rounded text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] cursor-pointer"
          />
          <label htmlFor="pageManageInventory" className="text-xs cursor-pointer select-none">
            <strong className="text-sm font-bold text-[var(--color-text-primary)] block">
              Maneja Inventario / Control de Stock
            </strong>
            <span className="text-[var(--color-text-secondary)]">
              Indica si este producto controla existencias en almacenes. Si está activado, se exigirá stock físico disponible para poder completar ventas directas.
            </span>
          </label>
        </div>

        {/* Audit Info in edit mode */}
        {isEditing && product && (
          <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-muted)]">
            <div className="flex justify-between">
              <span>Creado:</span>
              <span className="font-mono text-[var(--color-text-secondary)]">
                {new Date(product.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Última modificación:</span>
              <span className="font-mono text-[var(--color-text-secondary)]">
                {new Date(product.updatedAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        )}

        {/* Management advice */}
        <div className="p-4 rounded-2xl bg-[var(--color-sage-50)]/40 dark:bg-[var(--color-sage-500)]/10 border border-[var(--color-sage-200)] dark:border-[var(--color-sage-500)]/20 text-xs text-[var(--color-text-secondary)] flex gap-2.5">
          <Sparkles className="w-4 h-4 text-[var(--color-sage-600)] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[var(--color-text-primary)] block mb-1">
              Consejo de Gestión:
            </span>
            <p className="leading-relaxed">
              El margen de ganancia configurado se utiliza para calcular automáticamente el precio sugerido cada vez que se actualice el costo de compra o fabricación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductStatusSection;
