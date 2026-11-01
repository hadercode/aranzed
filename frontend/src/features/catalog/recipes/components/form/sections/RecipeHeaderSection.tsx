import { Package, Hash, Tag, Layers } from 'lucide-react';
import type { UseRecipeFormPageReturn } from '../../../hooks/logic/useRecipeFormPage';
import type { RecipeStatus } from '../../../types';
import { RecipeParentProductPicker } from './RecipeParentProductPicker';
import { RecipeStatusSelector } from './RecipeStatusSelector';

export interface RecipeHeaderSectionProps {
  formPage: UseRecipeFormPageReturn;
}

export function RecipeHeaderSection({ formPage }: RecipeHeaderSectionProps) {
  const { form, parentProductOptions, selectedParentProduct } = formPage;

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentStatus = watch('status') as RecipeStatus;

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
        <Package className="w-5 h-5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          Datos Generales y Producto a Fabricar
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RecipeParentProductPicker
          registration={register('productId')}
          parentProductOptions={parentProductOptions}
          selectedParentProduct={selectedParentProduct}
          error={errors.productId?.message}
        />

        {/* Recipe Code */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
            Código de Receta (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: BOM-0001 (autogenerado si vacío)"
            {...register('code')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all placeholder-[var(--color-text-muted)]"
          />
          {errors.code && <p className="text-xs text-destructive font-medium">{errors.code.message}</p>}
        </div>

        {/* Recipe Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
            Nombre Descriptivo de la Receta *
          </label>
          <input
            type="text"
            placeholder="Ej: Receta Estándar - Mesa de Roble"
            {...register('name')}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all ${
              errors.name ? 'border-destructive focus:border-destructive' : 'border-[var(--color-border)] focus:border-[var(--color-sage-500)]'
            }`}
          />
          {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
        </div>

        {/* Yield Quantity */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />
              Rendimiento Base (Unidades Producidas) *
            </span>
            <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">
              {selectedParentProduct?.uom?.code || 'Unidades'}
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              min="0.0001"
              placeholder="1.0"
              {...register('yieldQuantity', { valueAsNumber: true })}
              className={`w-full px-3.5 py-2.5 pr-14 rounded-xl border text-sm bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all ${
                errors.yieldQuantity ? 'border-destructive focus:border-destructive' : 'border-[var(--color-border)] focus:border-[var(--color-sage-500)]'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-text-muted)]">
              {selectedParentProduct?.uom?.code || 'UND'}
            </span>
          </div>
          {errors.yieldQuantity && <p className="text-xs text-destructive font-medium">{errors.yieldQuantity.message}</p>}
        </div>

        <RecipeStatusSelector
          currentStatus={currentStatus}
          onSelectStatus={(status) => setValue('status', status, { shouldValidate: true, shouldDirty: true })}
          error={errors.status?.message}
        />

        {/* Description / Process Notes */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
            Descripción / Instrucciones del Proceso de Fabricación (Opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Detalles sobre tiempos de secado, ensamblaje o tolerancias técnicas..."
            {...register('description')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all placeholder-[var(--color-text-muted)]"
          />
          {errors.description && <p className="text-xs text-destructive font-medium">{errors.description.message}</p>}
        </div>
      </div>
    </div>
  );
}
