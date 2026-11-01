import { useCompanyContext } from '../../context';

export function CompanyAddressFields() {
  const { formData, handleChange } = useCompanyContext();

  return (
    <>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Dirección Principal
        </label>
        <input
          type="text"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
          placeholder="Calle 123 # 45-67, Edificio Centro"
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
          placeholder="Piso 4, Oficina 402"
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
          placeholder="Bogotá"
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
          Departamento / Estado / Provincia
        </label>
        <input
          type="text"
          name="state"
          value={formData.state || ''}
          onChange={handleChange}
          placeholder="Cundinamarca"
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
          placeholder="110111"
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
          placeholder="Colombia"
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] text-sm"
        />
      </div>
    </>
  );
}

