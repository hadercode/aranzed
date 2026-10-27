import { useCompanyContext } from '../../context';

export function CurrencyTab() {
  const {
    formData,
    currencies,
    timezones,
    sampleFormattedPrice,
    handleChange,
    handleCurrencySelect,
  } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--color-border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Código de Moneda (ISO) *
          </label>
          <input
            type="text"
            name="currencyCode"
            value={formData.currencyCode || ''}
            onChange={handleChange}
            required
            placeholder="USD"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Símbolo de la Moneda *
          </label>
          <input
            type="text"
            name="currencySymbol"
            value={formData.currencySymbol || ''}
            onChange={handleChange}
            required
            placeholder="$"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Posición del Símbolo
          </label>
          <select
            name="currencyPosition"
            value={formData.currencyPosition || 'left'}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          >
            <option value="left">Izquierda ($ 100)</option>
            <option value="right">Derecha (100 $)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Lugares Decimales
          </label>
          <input
            type="number"
            min="0"
            max="4"
            name="decimalPlaces"
            value={formData.decimalPlaces ?? 2}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Zona Horaria (Timezone)
          </label>
          <select
            name="timezone"
            value={formData.timezone || 'UTC'}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Formato de Fecha
          </label>
          <select
            name="dateFormat"
            value={formData.dateFormat || 'YYYY-MM-DD'}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-11)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (11/10/2026)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (10/11/2026)</option>
          </select>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Previsualización de Moneda
          </p>
          <p className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">
            {sampleFormattedPrice}
          </p>
        </div>
        <div className="text-xs text-[var(--color-text-muted)] text-right">
          Formato numérico aplicado
        </div>
      </div>
    </div>
  );
}

export default CurrencyTab;
