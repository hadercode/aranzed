import { User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { SectionHeader } from '@/shared/components/ui/SectionHeader';
import { TextInput } from '@/shared/components/ui';
import { useSalesFormContext } from '../../../context';

export function SaleCustomerSection() {
  const { form } = useSalesFormContext();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)] space-y-6">
      <SectionHeader
        icon={<User className="w-4 h-4" />}
        title="Información del Cliente"
        description="Datos de contacto y facturación del receptor del documento"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Nombre / Razón Social */}
        <TextInput
          label="Nombre / Razón Social del Cliente"
          required
          placeholder="Ej. Consumidor Final, Inversiones ABC C.A."
          leftIcon={<User className="w-4 h-4" />}
          error={errors.customerName?.message}
          containerClassName="lg:col-span-2"
          {...register('customerName')}
        />

        {/* Cédula / RIF / NIT */}
        <TextInput
          label="Identificación Fiscal (RIF / C.I.)"
          placeholder="Ej. J-12345678-0, V-12345678"
          leftIcon={<CreditCard className="w-4 h-4" />}
          error={errors.customerTaxId?.message}
          {...register('customerTaxId')}
        />

        {/* Teléfono */}
        <TextInput
          label="Teléfono de Contacto"
          placeholder="Ej. +58 412 1234567"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.customerPhone?.message}
          {...register('customerPhone')}
        />

        {/* Correo Electrónico */}
        <TextInput
          type="email"
          label="Correo Electrónico"
          placeholder="cliente@ejemplo.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.customerEmail?.message}
          {...register('customerEmail')}
        />

        {/* Dirección Fiscal o de Entrega */}
        <TextInput
          label="Dirección Fiscal o de Entrega"
          placeholder="Ciudad, Zona o Calle"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.customerAddress?.message}
          containerClassName="lg:col-span-2"
          {...register('customerAddress')}
        />
      </div>
    </div>
  );
}

export default SaleCustomerSection;
