import { Link } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import { useProductFormContext } from '../../../context';

export function ProductClassificationSection() {
  const { register, errors, uoms, categories } = useProductFormContext();

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
        {/* Unit of Measure */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Unidad de Medida (UoM) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('uomId')}
              className={`w-full px-4 py-3 rounded-2xl text-sm border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.uomId
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
              }`}
            >
              <option value="">Seleccione una unidad de medida...</option>
              {uoms.map((uom) => (
                <option key={uom.id} value={uom.id}>
                  {uom.code} — {uom.name}{' '}
                  {uom.allowDecimals ? '(Permite decimales)' : ''}
                </option>
              ))}
            </select>
          </div>
          {errors.uomId ? (
            <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.uomId.message}</p>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Magnitud utilizada para cuantificar y facturar el producto (ej. UND, KG, LT, M).
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Categoría del Catálogo
          </label>
          <select
            {...register('categoryId')}
            className="w-full px-4 py-3 rounded-2xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
          >
            <option value="">Sin categoría asignada</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Permite agrupar este producto dentro de los filtros y reportes de la tienda.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductClassificationSection;
