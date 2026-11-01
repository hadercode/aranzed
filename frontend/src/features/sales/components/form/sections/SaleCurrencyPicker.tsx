import { DollarSign, Coins } from 'lucide-react';
import { FormGroup } from '@/shared/components/ui';

export interface SaleCurrencyPickerProps {
  documentCurrency: string;
  activeFunctional: string;
  functionalSymbol: string;
  activeLocal: string;
  localSymbol: string;
  onSelectCurrency: (currency: string) => void;
}

export function SaleCurrencyPicker({
  documentCurrency,
  activeFunctional,
  functionalSymbol,
  activeLocal,
  localSymbol,
  onSelectCurrency,
}: SaleCurrencyPickerProps) {
  return (
    <FormGroup label="Moneda del Documento" required>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectCurrency(activeFunctional)}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            documentCurrency === activeFunctional
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20 shadow-sm'
              : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>
            {activeFunctional} ({functionalSymbol})
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCurrency(activeLocal)}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            documentCurrency === activeLocal
              ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold ring-2 ring-blue-500/20 shadow-sm'
              : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>
            {activeLocal} ({localSymbol})
          </span>
        </button>
      </div>
    </FormGroup>
  );
}

