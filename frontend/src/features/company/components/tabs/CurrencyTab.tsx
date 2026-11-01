import { useCompanyContext } from '../../context';
import { CurrencyQuickSelector } from './CurrencyQuickSelector';

export function CurrencyTab() {
  const { formData, timezones, sampleFormattedPrice, handleChange } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <CurrencyQuickSelector />

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
            Símbolo de Moneda *
          </label>
          <input
            type="text"
            name="currencySymbol"
            value={formData.currencySymbol || ''}
            onChange={handleChange}
            required
            placeholder="$"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm font-bold"
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
            <option value="left">Izquierda ($ 100.00)</option>
            <option value="right">Derecha (100.00 $)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Número de Decimales
          </label>
          <input
            type="number"
            name="decimalPlaces"
            min={0}
            max={4}
            value={formData.decimalPlaces !== undefined ? formData.decimalPlaces : 2}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Zona Horaria Principal
          </label>
          <select
            name="timezone"
            value={formData.timezone || 'America/Bogota'}
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
            value={formData.dateFormat || 'DD/MM/YYYY'}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider block">
            Vista Previa de Precio
          </span>
          <span className="text-xl font-bold text-[var(--color-sage-600)] font-mono">
            {sampleFormattedPrice}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-xs text-right">
          Así es como se visualizarán los montos monetarios en facturas, cotizaciones y reportes.
        </p>
      </div>
    </div>
  );
}

export default CurrencyTab;
