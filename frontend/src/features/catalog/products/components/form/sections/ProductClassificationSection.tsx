import { Link } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../../schemas/product.schema';
import type { ProductUom, ProductCategory } from '../../../types';

export interface ProductClassificationSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  uoms: ProductUom[];
  categories: ProductCategory[];
}

export function ProductClassificationSection({
  register,
  errors,
  uoms,
  categories,
}: ProductClassificationSectionProps) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[var(--color-sage-600)]" />
          3. Clasificación y Unidades de Medida
        </span>
        <div className="flex items-center gap-3 text-xs text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
          <Link
            to="/catalog/units-of-measure"
            target="_blank"
            className="hover:underline"
          >
            + Gestionar UoM
          </Link>
          <span>•</span>
          <Link
            to="/catalog/categories"
            target="_blank"
            className="hover:underline"
          >
            + Gestionar Categorías
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Unit of Measure Select */}
        <Select
          label="Unidad de Medida (UoM)"
          required
          {...register('uomId')}
          error={errors.uomId?.message}
          helperText={
            !errors.uomId
              ? 'Magnitud para cuantificar y facturar (ej. UND, KG, LT, M).'
              : undefined
          }
        >
          <option value="">Seleccione una unidad de medida...</option>
          {uoms.map((uom) => (
            <option key={uom.id} value={uom.id}>
              {uom.name} ({uom.code})
            </option>
          ))}
        </Select>

        {/* Category Select */}
        <Select
          label="Categoría del Producto"
          {...register('categoryId')}
          error={errors.categoryId?.message}
          helperText="Organización interna para reportes, filtros y balances."
        >
          <option value="">Sin categoría asignada</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default ProductClassificationSection;
