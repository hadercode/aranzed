import { useCompanyContext } from '../../context';

export function CurrencyQuickSelector() {
  const { formData, currencies, handleCurrencySelect } = useCompanyContext();

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
        Monedas Habituales (Selección rápida)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {currencies.map((curr) => {
          const isSelected = formData.currencyCode === curr.code;
          return (
            <button
              key={curr.code}
              type="button"
              onClick={() => handleCurrencySelect(curr.code)}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-50)] text-[var(--color-sage-600)] font-semibold shadow-sm'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
              }`}
            >
              <span className="font-bold text-sm text-[var(--color-text-primary)]">
                {curr.code}
              </span>
              <span>
                {curr.symbol} - {curr.name.split('(')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

