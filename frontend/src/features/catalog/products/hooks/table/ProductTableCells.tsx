import { Package, Edit2, Trash2 } from 'lucide-react';
import { getAssetUrl } from '@/lib/api-client';
import type { Product, ProductCategory, ProductUom } from '../../types';

export function ProductNameCell({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3">
      {product.imageUrl ? (
        <img
          src={getAssetUrl(product.imageUrl)}
          alt={product.name}
          className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border)] shrink-0 bg-[var(--color-surface-bg)]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-sage-600)] transition-colors">
          <Package className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0 max-w-xs">
        <div className="font-semibold text-[var(--color-text-primary)] truncate">
          {product.name}
        </div>
        {product.description && (
          <div className="text-xs text-[var(--color-text-muted)] line-clamp-1">
            {product.description}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCategoryCell({
  category,
}: {
  category?: ProductCategory | null;
}) {
  if (!category?.name) {
    return (
      <span className="text-xs text-[var(--color-text-muted)] italic">
        Sin categoría
      </span>
    );
  }

  return (
    <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
      {category.name}
    </span>
  );
}

export function ProductUomCell({ uom }: { uom?: ProductUom | null }) {
  if (!uom) {
    return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/15 text-[var(--color-sage-700)] dark:text-[var(--color-sage-300)]">
        {uom.code}
      </span>
      <span className="text-xs text-[var(--color-text-secondary)]">
        {uom.name}
      </span>
    </div>
  );
}

export function ProductActionsCell({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(product)}
        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-sage-600)] hover:bg-[var(--color-surface-bg)] transition-colors cursor-pointer"
        title="Editar producto"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(product)}
        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
