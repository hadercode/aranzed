import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput, Select, Textarea } from '@/shared/components/ui/form';
import type { Category } from '@/features/catalog/categories/types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import type { ProductFormData } from '../../schemas/product.schema';

export interface ProductModalGeneralFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  uoms: UnitOfMeasure[];
  categories: Category[];
}

export function ProductModalGeneralFields({
  register,
  errors,
  uoms,
  categories,
}: ProductModalGeneralFieldsProps) {
  return (
    <div className="space-y-3.5">
      <TextInput
        label="Nombre Comercial"
        required
        {...register('name')}
        placeholder="Ej. Laptop ThinkPad T14, Mesa Roble Ensamblada, Consultoría TI..."
        maxLength={150}
        error={errors.name?.message}
      />

      <Select label="Unidad de Medida" required {...register('uomId')} error={errors.uomId?.message}>
        <option value="">Seleccione una unidad...</option>
        {uoms.map((uom) => (
          <option key={uom.id} value={uom.id}>
            {uom.code} — {uom.name}
          </option>
        ))}
      </Select>

      <Select label="Categoría" {...register('categoryId')}>
        <option value="">Sin categoría asignada</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Textarea
        label="Descripción Detallada"
        rows={2}
        {...register('description')}
        placeholder="Especificaciones técnicas, notas de fabricación o detalles del servicio..."
        error={errors.description?.message}
      />
    </div>
  );
}

