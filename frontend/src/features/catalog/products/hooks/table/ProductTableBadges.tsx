import { ShoppingBag, Boxes, Layers, Wrench } from 'lucide-react';
import type { Product, ProductType } from '../../types';

export function ProductTypeBadge({ type }: { type: ProductType }) {
  switch (type) {
    case 'TRADITIONAL':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
          <ShoppingBag className="w-3 h-3" />
          Tradicional
        </span>
      );
    case 'RAW_MATERIAL':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <Boxes className="w-3 h-3" />
          Materia Prima
        </span>
      );
    case 'FINISHED_GOOD':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
          <Layers className="w-3 h-3" />
          Terminado
        </span>
      );
    case 'SERVICE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
          <Wrench className="w-3 h-3" />
          Servicio
        </span>
      );
    default:
      return null;
  }
}

export function ProductPurposeBadges({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 max-w-[190px] mx-auto">
      {product.isForSale !== false ? (
        <span
          title="Disponible para ventas en POS y pedidos"
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
        >
          Venta
        </span>
      ) : (
        <span
          title="No habilitado para la venta comercial directa"
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
        >
          No venta
        </span>
      )}

      {product.isForInternalUse && (
        <span
          title="Habilitado como insumo de producción o consumo interno"
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
        >
          Insumo
        </span>
      )}

      {product.manageInventory !== false ? (
        <span
          title="Controla existencias físicas (FIFO) en almacenes"
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
        >
          Stock
        </span>
      ) : (
        <span
          title="Sin control de inventario físico"
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-normal bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
        >
          Sin stock
        </span>
      )}
    </div>
  );
}

export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Activo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
      Inactivo
    </span>
  );
}
