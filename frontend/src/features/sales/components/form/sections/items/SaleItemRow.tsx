import { useWatch } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { TextInput, Select } from '@/shared/components/ui';
import { useSalesFormContext } from '../../../../context';

export interface SaleItemRowProps {
  index: number;
  onRemove: (index: number) => void;
}

export function SaleItemRow({ index, onRemove }: SaleItemRowProps) {
  const { form, sellableProducts, allProducts } = useSalesFormContext();
  const {
    register,
    control,
    handleProductSelect,
    handleToggleTaxable,
    watchedRate,
    formState: { errors },
  } = form;

  const itemValues = useWatch({
    control,
    name: `items.${index}`,
  });

  const selectedProductId = itemValues?.productId || '';
  const quantity = Number(itemValues?.quantity) || 0;
  const unitPrice = Number(itemValues?.unitPrice) || 0;
  const discountRate = Math.max(0, Math.min(100, Number(itemValues?.discountRate) || 0));
  const isTaxable = itemValues?.isTaxable !== undefined ? Boolean(itemValues.isTaxable) : true;
  const taxRate = Number(itemValues?.taxRate) >= 0 ? Number(itemValues.taxRate) : 16.0;

  // Cálculos de línea
  const gross = quantity * unitPrice;
  const discountAmount = (gross * discountRate) / 100;
  const net = gross - discountAmount;
  const taxAmount = isTaxable ? (net * taxRate) / 100 : 0;
  const lineTotalUSD = net + taxAmount;
  const lineTotalLocal = lineTotalUSD * (watchedRate > 0 ? watchedRate : 1.0);

  const itemError = (errors.items as any)?.[index];
  const productsList = sellableProducts.length > 0 ? sellableProducts : allProducts;

  const productOptions = [
    {
      value: '',
      label:
        productsList.length === 0
          ? '-- Sin productos disponibles --'
          : '-- Seleccionar producto del catálogo --',
    },
    ...productsList.map((p) => {
      const priceUSD = Number(p.lastSalePrice || 0);
      const priceBs = (priceUSD * watchedRate).toFixed(2);
      return {
        value: p.id,
        label: `${p.name} — $${priceUSD.toFixed(2)} USD (Bs. ${priceBs})`,
      };
    }),
  ];

  return (
    <tr className="hover:bg-[var(--color-surface-bg)]/60 transition-colors border-b border-[var(--color-border)] text-xs">
      {/* 0. Número de Línea */}
      <td className="py-2.5 px-3 text-center text-[var(--color-text-muted)] font-mono text-[11px] w-10 align-top pt-3.5">
        {index + 1}
      </td>

      {/* 1. Selector de Producto */}
      <td className="py-2.5 px-3 min-w-[260px] align-top">
        <Select
          sizeVariant="sm"
          value={selectedProductId}
          onChange={(e) => handleProductSelect(index, e.target.value)}
          error={itemError?.productId?.message}
          options={productOptions}
        />
      </td>

      {/* 2. Descripción personalizada */}
      <td className="py-2.5 px-2 min-w-[180px] align-top">
        <TextInput
          sizeVariant="sm"
          placeholder="Descripción en comprobante..."
          error={itemError?.description?.message}
          {...register(`items.${index}.description`)}
        />
      </td>

      {/* 3. Cantidad */}
      <td className="py-2.5 px-2 w-24 align-top">
        <TextInput
          sizeVariant="sm"
          type="number"
          step="any"
          min="1"
          className="text-center font-bold"
          error={itemError?.quantity?.message}
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        />
      </td>

      {/* 4. Precio Unitario en USD */}
      <td className="py-2.5 px-2 w-36 align-top">
        <TextInput
          sizeVariant="sm"
          type="number"
          step="0.01"
          min="0"
          leftIcon={<span className="text-gray-400 font-semibold text-[11px]">$</span>}
          className="text-right font-semibold"
          error={itemError?.unitPrice?.message}
          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
        />
        <span className="block text-[10px] text-[var(--color-text-muted)] text-right mt-1 font-mono">
          Bs. {(unitPrice * watchedRate).toFixed(2)}
        </span>
      </td>

      {/* 5. Descuento % */}
      <td className="py-2.5 px-2 w-24 align-top">
        <TextInput
          sizeVariant="sm"
          type="number"
          step="1"
          min="0"
          max="100"
          rightIcon={<span className="text-gray-400 font-semibold text-[10px]">%</span>}
          className="text-center font-medium"
          {...register(`items.${index}.discountRate`, {
            valueAsNumber: true,
          })}
        />
      </td>

      {/* 6. Tratamiento de IVA */}
      <td className="py-2.5 px-2 w-24 text-center align-top pt-2">
        <button
          type="button"
          onClick={() => handleToggleTaxable(index, !isTaxable)}
          className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
            isTaxable
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
          }`}
          title={isTaxable ? 'Gravable IVA 16%' : 'Exento de IVA'}
        >
          <span>{isTaxable ? '16%' : 'Exento'}</span>
        </button>
      </td>

      {/* 7. Subtotal Calculado */}
      <td className="py-2.5 px-3 text-right whitespace-nowrap min-w-[120px] align-top pt-2">
        <div className="font-bold text-sm text-[var(--color-text-primary)]">
          ${lineTotalUSD.toFixed(2)}
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
          Bs. {lineTotalLocal.toFixed(2)}
        </div>
      </td>

      {/* 8. Botón Eliminar Fila */}
      <td className="py-2.5 px-2 text-center w-12 align-top pt-2">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Eliminar este producto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

export default SaleItemRow;
