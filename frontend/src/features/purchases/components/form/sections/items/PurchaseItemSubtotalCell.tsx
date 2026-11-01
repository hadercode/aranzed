import { useState } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import type { PurchaseFormData } from '../../../../schemas/purchase.schema';
import { useCurrencyStore } from '@/shared/hooks/store';

export function PurchaseItemSubtotalCell({
  control,
  index,
  onSubtotalChange,
  error,
}: {
  control: Control<PurchaseFormData>;
  index: number;
  onSubtotalChange: (index: number, subtotal: number) => void;
  error?: { message?: string };
}) {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const item = useWatch({ control, name: `items.${index}` });
  const exchangeRate = Number(useWatch({ control, name: 'exchangeRate' })) || 1.0;
  const documentCurrency = useWatch({ control, name: 'documentCurrency' }) || functionalCurrency;

  const isDocLocal = documentCurrency === localCurrency;
  const primarySymbol = isDocLocal ? localSymbol : functionalSymbol;
  const convertedSymbol = isDocLocal ? functionalSymbol : localSymbol;
  const convertedLocale = isDocLocal ? 'en-US' : 'es-VE';

  const qty = Number(item?.quantity) || 0;
  const costInput = Number(item?.unitCost) || 0;
  const subtotalPrimary =
    item?.subtotal !== undefined ? Number(item.subtotal) : Number((qty * costInput).toFixed(2));

  const [localVal, setLocalVal] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const displayVal = isFocused
    ? localVal
    : subtotalPrimary > 0
    ? Number(subtotalPrimary).toFixed(2)
    : '';

  const handleFocus = () => {
    setIsFocused(true);
    setLocalVal(subtotalPrimary > 0 ? String(subtotalPrimary) : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setLocalVal(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0) {
      onSubtotalChange(index, parsed);
    } else if (text === '') {
      onSubtotalChange(index, 0);
    }
  };

  const subtotalConverted = isDocLocal
    ? exchangeRate > 0
      ? subtotalPrimary / exchangeRate
      : 0
    : subtotalPrimary * exchangeRate;

  return (
    <div>
      <div className="relative">
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold ${
            isDocLocal ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {primarySymbol}
        </span>
        <input
          type="number"
          step="any"
          min="0"
          placeholder="0.00"
          value={displayVal}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-xs font-mono text-right bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 ${
            isDocLocal ? 'focus:ring-blue-500' : 'focus:ring-emerald-500'
          } transition-all ${error ? 'border-rose-500' : 'border-[var(--color-border)]'}`}
        />
      </div>
      <div className="flex justify-end mt-0.5">
        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
          ≈ {convertedSymbol}{' '}
          {subtotalConverted.toLocaleString(convertedLocale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      {error && <p className="text-[10px] text-rose-500 mt-0.5 font-medium text-right">{error.message}</p>}
    </div>
  );
}

