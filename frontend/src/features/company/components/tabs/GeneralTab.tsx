import { useCompanyContext } from '../../context';

export function GeneralTab() {
  const { formData, handleChange } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Razón Social / Nombre Legal *
          </label>
          <input
            type="text"
            name="legalName"
            value={formData.legalName || ''}
            onChange={handleChange}
            required
            placeholder="Ej. Acme Corporation S.A.S."
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm transition-all"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Nombre oficial con el que está constituida la empresa
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Identificación Fiscal (RUT / RUC / NIT / CIF) *
          </label>
          <input
            type="text"
            name="identificationNumber"
            value={formData.identificationNumber || ''}
            onChange={handleChange}
            required
            placeholder="Ej. J-12345678-0 ó 900.123.456-7"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm transition-all"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Número de registro fiscal o tributario ante las autoridades
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Nombre Comercial (Trade Name)
          </label>
          <input
            type="text"
            name="tradeName"
            value={formData.tradeName || ''}
            onChange={handleChange}
            placeholder="Ej. Acme Store"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Lema / Eslogan Comercial
          </label>
          <input
            type="text"
            name="slogan"
            value={formData.slogan || ''}
            onChange={handleChange}
            placeholder="Ej. Calidad e innovación para tu negocio"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm transition-all"
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralTab;
