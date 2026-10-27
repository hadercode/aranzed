import { Image as ImageIcon, Package } from 'lucide-react';
import { useProductFormContext } from '../../../context';

export function ProductMediaSection() {
  const { register, errors, imageUrlValue, productNameValue } = useProductFormContext();

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[var(--color-sage-600)]" />
          5. Multimedia e Imagen
        </span>
        {imageUrlValue && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
            Vista previa activa
          </span>
        )}
      </div>

      {/* Image Preview Box */}
      <div className="relative aspect-4/3 rounded-2xl border-2 border-dashed border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-bg)] flex items-center justify-center group">
        {imageUrlValue ? (
          <img
            src={imageUrlValue}
            alt={productNameValue || 'Vista previa del producto'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="text-center p-6 text-[var(--color-text-secondary)]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-2">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium block">
              Sin imagen asignada
            </span>
            <span className="text-[11px] block text-[var(--color-text-muted)] mt-0.5">
              Ingresa una URL debajo para previsualizarla
            </span>
          </div>
        )}
      </div>

      {/* Image URL Input */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
          URL de la Imagen (HTTPS)
        </label>
        <input
          type="text"
          {...register('imageUrl')}
          placeholder="https://images.unsplash.com/photo-..."
          className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
            errors.imageUrl
              ? 'border-rose-500 focus:ring-rose-500/30'
              : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
          }`}
        />
        {errors.imageUrl ? (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.imageUrl.message}</p>
        ) : (
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            Enlace directo HTTPS a la fotografía del producto.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductMediaSection;
