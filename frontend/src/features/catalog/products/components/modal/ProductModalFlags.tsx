import { ShieldCheck, Store, Factory, Boxes } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import { Checkbox } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../schemas/product.schema';

export interface ProductModalFlagsProps {
  register: UseFormRegister<ProductFormData>;
}

export function ProductModalFlags({ register }: ProductModalFlagsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <Checkbox
        card
        label={
          <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Producto Activo
          </span>
        }
        description="Habilitado en el catálogo general."
        {...register('isActive')}
      />

      <Checkbox
        card
        label={
          <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
            <Store className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Disponible para Venta
          </span>
        }
        description="Visible en POS y ventas comerciales."
        {...register('isForSale')}
      />

      <Checkbox
        card
        label={
          <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
            <Factory className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Uso Interno / Insumo
          </span>
        }
        description="Disponible para recetas y manufactura."
        {...register('isForInternalUse')}
      />

      <Checkbox
        card
        label={
          <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
            <Boxes className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Controla Inventario
          </span>
        }
        description="Valuación FIFO y stock en almacén."
        {...register('manageInventory')}
      />
    </div>
  );
}

