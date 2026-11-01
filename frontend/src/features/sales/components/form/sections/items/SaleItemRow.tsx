import { useWatch } from 'react-hook-form';
import { TextInput, Select } from '@/shared/components/ui';
import type { UseSaleFormReturn } from '../../../../hooks/logic/useSaleForm';
import type { Product } from '@/features/catalog/products/types';
import { calculateSaleItemLine, buildSaleItemProductOptions } from './saleItemRowHelpers';
import { SaleItemTotalsCell } from './SaleItemTotalsCell';

export interface SaleItemRowProps {
  index: number;
  onRemove: (index: number) => void;
  form: UseSaleFormReturn;
  sellableProducts: Product[];
  allProducts: Product[];
}

export function SaleItemRow({
  index,
  onRemove,
  form,
  sellableProducts,
  allProducts,
}: SaleItemRowProps) {
  const {
    register,
    control,
    handleProductSelect,
    handleToggleTaxable,
    watchedRate,
    formState: { errors },
  } = form;

  const itemValues = useWatch({ control, name: `items.${index}` });

  const selectedProductId = itemValues?.productId || '';
  const quantity = Number(itemValues?.quantity) || 0;
  const unitPrice = Number(itemValues?.unitPrice) || 0;
  const discountRate = Math.max(0, Math.min(100, Number(itemValues?.discountRate) || 0));
  const isTaxable = itemValues?.isTaxable !== undefined ? Boolean(itemValues.isTaxable) : true;
  const taxRate = Number(itemValues?.taxRate) >= 0 ? Number(itemValues.taxRate) : 16.0;

  const { lineTotalUSD, lineTotalLocal } = calculateSaleItemLine({
    quantity,
    unitPrice,
    discountRate,
    isTaxable,
    taxRate,
    watchedRate,
  });

  const itemError = (errors.items as any)?.[index];
  const productsList = sellableProducts.length > 0 ? sellableProducts : allProducts;
  const productOptions = buildSaleItemProductOptions(productsList, watchedRate);

  return (
    <tr className="hover:bg-[var(--color-surface-bg)]/60 transition-colors border-b border-[var(--color-border)] text-xs">
      <td className="py-2.5 px-3 text-center text-[var(--color-text-muted)] font-mono text-[11px] w-10 align-top pt-3.5">
        {index + 1}
      </td>

      <td className="py-2.5 px-3 min-w-[260px] align-top">
        <Select
          sizeVariant="sm"
          value={selectedProductId}
          onChange={(e) => handleProductSelect(index, e.target.value)}
          error={itemError?.productId?.message}
          options={productOptions}
        />
      </td>

      <td className="py-2.5 px-2 min-w-[180px] align-top">
        <TextInput
          sizeVariant="sm"
          placeholder="Descripción en comprobante..."
          error={itemError?.description?.message}
          {...register(`items.${index}.description`)}
        />
      </td>

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

      <td className="py-2.5 px-2 w-24 align-top">
        <TextInput
          sizeVariant="sm"
          type="number"
          step="1"
          min="0"
          max="100"
          rightIcon={<span className="text-gray-400 font-semibold text-[10px]">%</span>}
          className="text-center font-medium"
          {...register(`items.${index}.discountRate`, { valueAsNumber: true })}
        />
      </td>

      <SaleItemTotalsCell
        index={index}
        isTaxable={isTaxable}
        lineTotalUSD={lineTotalUSD}
        lineTotalLocal={lineTotalLocal}
        onToggleTaxable={handleToggleTaxable}
        onRemove={onRemove}
      />
    </tr>
  );
}

export default SaleItemRow;
