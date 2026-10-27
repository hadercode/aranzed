import { useCompanyContext } from '../../context';

export function ContactTab() {
  const { formData, handleChange } = useCompanyContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Correo Electrónico Corporativo
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="contacto@miempresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Sitio Web Oficial
          </label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            placeholder="https://www.miempresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Teléfono Principal
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+57 300 123 4567"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Teléfono Secundario / PBX
          </label>
          <input
            type="tel"
            name="secondaryPhone"
            value={formData.secondaryPhone || ''}
            onChange={handleChange}
            placeholder="+57 (1) 234 5678"
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Ubicación & Domicilio Fiscal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Dirección Línea 1 *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Calle 100 # 15-20 Edificio Torre Norte"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Dirección Línea 2 (Opcional)
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2 || ''}
              onChange={handleChange}
              placeholder="Oficina 502 / Bodega 3"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Ej. Bogotá"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Estado / Provincia / Departamento
            </label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              placeholder="Ej. Cundinamarca"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Código Postal
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode || ''}
              onChange={handleChange}
              placeholder="Ej. 110111"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              País
            </label>
            <input
              type="text"
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              placeholder="Ej. Colombia"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactTab;
