import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Percent } from "lucide-react";
import type { DataTableColumn } from "@/shared/components/ui";
import { useProductsStore } from "../../store";
import type { Product } from "../../types";
import {
  ProductNameCell,
  ProductCategoryCell,
  ProductUomCell,
  ProductActionsCell,
} from "./ProductTableCells";
import { ProductTypeBadge, ProductStatusBadge } from "./ProductTableBadges";

export interface UseProductsTableColumnsOptions {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function useProductsTableColumns(
  options?: UseProductsTableColumnsOptions,
): DataTableColumn<Product>[] {
  const navigate = useNavigate();
  const openDeleteConfirm = useProductsStore((state) => state.openDeleteConfirm);

  const handleEdit =
    options?.onEdit ??
    ((product: Product) => navigate(`/catalog/products/${product.id}/edit`));
  const handleDelete = options?.onDelete ?? openDeleteConfirm;

  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        key: "name",
        title: "Producto",
        sortable: true,
        render: (product) => <ProductNameCell product={product} />,
      },
      {
        key: "type",
        title: "Tipo",
        sortable: true,
        render: (product) => <ProductTypeBadge type={product.type} />,
      },
      {
        key: "category",
        title: "Categoría",
        sortable: true,
        render: (product) => (
          <ProductCategoryCell category={product.category} />
        ),
      },
      {
        key: "uom",
        title: "Unidad",
        sortable: true,
        render: (product) => <ProductUomCell uom={product.uom} />,
      },
      {
        key: "lastCost",
        title: "Último Costo",
        align: "right",
        sortable: true,
        render: (product) => (
          <span className="font-mono text-sm text-[var(--color-text-secondary)]">
            ${Number(product.lastCost || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: "profitMargin",
        title: "Margen",
        align: "center",
        sortable: true,
        render: (product) => (
          <span className="inline-flex items-center gap-0.5 font-semibold text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            <Percent className="w-2.5 h-2.5" />
            {Number(product.profitMargin || 0).toFixed(1)}%
          </span>
        ),
      },
      {
        key: "lastSalePrice",
        title: "Precio Venta",
        align: "right",
        sortable: true,
        render: (product) => (
          <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">
            ${Number(product.lastSalePrice || 0).toFixed(2)}
          </span>
        ),
      },
      {
        key: "isActive",
        title: "Estado",
        align: "center",
        sortable: true,
        render: (product) => <ProductStatusBadge isActive={product.isActive} />,
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (product) => (
          <ProductActionsCell
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  return columns;
}
