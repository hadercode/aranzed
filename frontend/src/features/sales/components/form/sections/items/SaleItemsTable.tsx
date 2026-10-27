import { useSalesFormContext } from '../../../../context';
import { SaleItemRow } from './SaleItemRow';

export function SaleItemsTable() {
  const { form } = useSalesFormContext();
  const { itemsFields, removeItem } = form;

  return (
    <div className="border border-[var(--color-border)] rounded-2xl overflow-x-auto shadow-sm bg-[var(--color-surface-card)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            <th className="py-2.5 px-3 text-center w-10">#</th>
            <th className="py-2.5 px-3 min-w-[240px]">Producto / Servicio *</th>
            <th className="py-2.5 px-2 min-w-[180px]">Descripción</th>
            <th className="py-2.5 px-2 text-center w-24">Cant. *</th>
            <th className="py-2.5 px-2 text-right w-36">Precio Unitario *</th>
            <th className="py-2.5 px-2 text-center w-24">Desc. %</th>
            <th className="py-2.5 px-2 text-center w-24">IVA</th>
            <th className="py-2.5 px-3 text-right min-w-[120px]">Subtotal</th>
            <th className="py-2.5 px-2 text-center w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {itemsFields.map((field, index) => (
            <SaleItemRow
              key={field.id}
              index={index}
              onRemove={removeItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SaleItemsTable;
