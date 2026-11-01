import { useWatch, type Control } from 'react-hook-form';
import type { PurchaseFormData } from '../../../../schemas/purchase.schema';
import { useCurrencyStore } from '@/shared/hooks/store';

export function PurchaseItemTotalCell({
  control,
  index,
}: {
  control: Control<PurchaseFormData>;
  index: number;
}) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const item = useWatch({ control, name: `items.${index}` });
  const exchangeRate = Number(useWatch({ control, name: 'exchangeRate' })) || 1.0;
  const documentCurrency = useWatch({ control, name: 'documentCurrency' }) || functionalCurrency;

  const isDocLocal = documentCurrency === localCurrency;
  const primarySymbol = isDocLocal ? localSymbol : functionalSymbol;
  const convertedSymbol = isDocLocal ? functionalSymbol : localSymbol;
  const primaryLocale = isDocLocal ? 'es-VE' : 'en-US';
  const convertedLocale = isDocLocal ? 'en-US' : 'es-VE';

  const qty = Number(item?.quantity) || 0;
  const costInput = Number(item?.unitCost) || 0;
  const isTaxable = item?.isTaxable !== false;
  const taxRate = isTaxable ? (Number(item?.taxRate) > 0 ? Number(item?.taxRate) : 16.0) : 0;

  const subtotal =
    item?.subtotal !== undefined && item.subtotal > 0 ? Number(item.subtotal) : qty * costInput;
  const tax = (subtotal * taxRate) / 100;
  const totalPrimary = subtotal + tax;

  const totalConverted = isDocLocal
    ? exchangeRate > 0
      ? totalPrimary / exchangeRate
      : 0
    : totalPrimary * exchangeRate;

  return (
    <div className="flex flex-col items-end">
      <span
        className={`font-mono font-bold text-xs ${
          isDocLocal ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {primarySymbol}{' '}
        {totalPrimary.toLocaleString(primaryLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="font-mono font-medium text-[10px] text-[var(--color-text-muted)]">
        {convertedSymbol}{' '}
        {totalConverted.toLocaleString(convertedLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

