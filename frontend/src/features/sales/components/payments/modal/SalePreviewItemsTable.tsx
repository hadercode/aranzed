import type { SaleItem } from "../../../types";

interface SalePreviewItemsTableProps {
  items?: SaleItem[];
}

export function SalePreviewItemsTable({ items = [] }: SalePreviewItemsTableProps) {
  return (
    <div>
      <h3 className="font-semibold text-[var(--color-text-primary)] mb-3 text-sm">
        Productos y Servicios en Detalle ({items.length})
      </h3>
      <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Descripción</th>
              <th className="py-2.5 px-3 text-center">Cant.</th>
              <th className="py-2.5 px-3 text-right">Precio USD</th>
              <th className="py-2.5 px-3 text-center">Desc.</th>
              <th className="py-2.5 px-3 text-center">IVA</th>
              <th className="py-2.5 px-3 text-right">Total USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {items.map((it, idx) => (
              <tr key={it.id || idx} className="hover:bg-[var(--color-surface-bg)]/50">
                <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                <td className="py-2.5 px-3 font-medium text-[var(--color-text-primary)]">
                  {it.description}
                </td>
                <td className="py-2.5 px-3 text-center font-semibold">{it.quantity}</td>
                <td className="py-2.5 px-3 text-right">${it.unitPrice.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-center text-gray-500">
                  {it.discountRate > 0 ? `${it.discountRate}%` : "-"}
                </td>
                <td className="py-2.5 px-3 text-center text-gray-500">
                  {it.isTaxable ? `${it.taxRate}%` : "Exento"}
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-[var(--color-text-primary)]">
                  ${it.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

