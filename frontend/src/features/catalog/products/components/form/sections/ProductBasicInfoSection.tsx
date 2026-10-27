import { Package } from 'lucide-react';
import { useProductFormContext } from '../../../context';

export function ProductBasicInfoSection() {
  const { register, errors, productNameValue } = useProductFormContext();

  const nameCharCount = (productNameValue || '').length;

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--color-sage-600)]" />
          2. Información General del Artículo
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {nameCharCount}/150 caracteres
        </span>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Nombre del Producto / Servicio <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="Ej. Laptop ThinkPad T14 Gen 3, Escritorio Modular Roble, Mantenimiento TI..."
            maxLength={150}
            className={`w-full px-4 py-3 rounded-2xl text-sm font-medium border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-rose-500 focus:ring-rose-500/30'
                : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
            }`}
          />
          {errors.name ? (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name.message}</p>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Nombre descriptivo y claro para cotizaciones, compras e inventario (máx. 150 caracteres).
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Descripción Detallada (Opcional)
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Detalles técnicos, especificaciones de garantía, instrucciones de uso o alcance del servicio..."
            maxLength={1000}
            className="w-full px-4 py-3 rounded-2xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all resize-y"
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductBasicInfoSection;
