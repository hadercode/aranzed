import { CheckCircle2, Sparkles, Store, Factory, Boxes, ShieldCheck } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import { Checkbox } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../../schemas/product.schema';
import type { Product } from '../../../types';

export interface ProductStatusSectionProps {
  register: UseFormRegister<ProductFormData>;
  isEditing?: boolean;
  product?: Product | null;
}

export function ProductStatusSection({
  register,
  isEditing = false,
  product = null,
}: ProductStatusSectionProps) {

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-sage-600)]" />
            6. Estado, Propósito y Disponibilidad Operativa
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Configura las reglas de disponibilidad en ventas, producción y existencias físicas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. General Active Lifecycle Toggle */}
        <Checkbox
          card
          label={
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <strong className="text-sm font-bold text-[var(--color-text-primary)]">
                Producto Activo en el Catálogo
              </strong>
            </span>
          }
          description="Habilita este registro para su uso operativo y visibilidad en todos los módulos del sistema."
          {...register('isActive')}
        />

        {/* 2. Commercial Sale Toggle */}
        <Checkbox
          card
          label={
            <span className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <strong className="text-sm font-bold text-[var(--color-text-primary)]">
                Disponible para la Venta
              </strong>
            </span>
          }
          description="Permite emitir ventas comerciales, pedidos y cotizaciones en el Punto de Venta (POS)."
          {...register('isForSale')}
        />

        {/* 3. Internal Use / Production Component Toggle */}
        <Checkbox
          card
          label={
            <span className="flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <strong className="text-sm font-bold text-[var(--color-text-primary)]">
                Uso Interno / Insumo de Producción
              </strong>
            </span>
          }
          description="Habilita este ítem como componente o materia prima en recetas de manufactura o consumo interno."
          {...register('isForInternalUse')}
        />

        {/* 4. Manage Inventory Toggle */}
        <Checkbox
          card
          label={
            <span className="flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <strong className="text-sm font-bold text-[var(--color-text-primary)]">
                Control de Inventario / Stock Físico
              </strong>
            </span>
          }
          description="Controla existencias físicas, movimientos y valuación en almacenes mediante el método FIFO."
          {...register('manageInventory')}
        />
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
            Flexibilidad y Control Operativo:
          </span>
          <p className="leading-relaxed">
            Las opciones recomendadas según el tipo se asignan automáticamente al crear el producto, pero puedes modificarlas libremente en cualquier momento según las necesidades operativas de tu empresa.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductStatusSection;
