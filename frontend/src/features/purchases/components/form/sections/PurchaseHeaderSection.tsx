import { Building2, FileText, Calendar, TrendingUp } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { PurchaseFormData } from '../../../schemas/purchase.schema';
import { TextInput, Textarea } from '@/shared/components/ui';
import { useCurrencyStore } from '@/shared/hooks/store';
import { PurchaseCurrencyPicker } from './PurchaseCurrencyPicker';
import { PurchaseStatusPicker } from './PurchaseStatusPicker';

export interface PurchaseHeaderSectionProps {
  form: UseFormReturn<PurchaseFormData>;
}

export function PurchaseHeaderSection({ form }: PurchaseHeaderSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const currentStatus = watch('status');
  const watchedRate = watch('exchangeRate');
  const activeFunctional = watch('functionalCurrency') || functionalCurrency;
  const activeLocal = watch('localCurrency') || localCurrency;
  const documentCurrency = watch('documentCurrency') || activeFunctional;

  return (
    <div
      id="tour-purchase-header"
      className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Datos del Comprobante y Proveedor
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Cabecera con selección de moneda de origen de la factura ({activeFunctional} / {activeLocal})
            </p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>
            1 {activeFunctional} ={' '}
            {Number(watchedRate || 1).toLocaleString('es-VE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}{' '}
            {activeLocal}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <TextInput
          label="Nombre / Razón Social del Proveedor"
          required
          placeholder="Ej: Maderas y Herrajes Industriales C.A."
          leftIcon={<Building2 size={18} />}
          error={errors.supplierName?.message}
          containerClassName="lg:col-span-2"
          {...register('supplierName')}
        />

        <TextInput
          label="N° Factura / Documento"
          required
          placeholder="Ej: FAC-002941"
          leftIcon={<FileText size={18} />}
          error={errors.invoiceNumber?.message}
          className="font-mono"
          {...register('invoiceNumber')}
        />

        <TextInput
          type="date"
          label="Fecha de Emisión"
          required
          leftIcon={<Calendar size={18} />}
          error={errors.purchaseDate?.message}
          {...register('purchaseDate')}
        />

        <PurchaseCurrencyPicker
          documentCurrency={documentCurrency}
          activeFunctional={activeFunctional}
          functionalSymbol={functionalSymbol}
          activeLocal={activeLocal}
          localSymbol={localSymbol}
          onSelectCurrency={(cur) => setValue('documentCurrency', cur, { shouldDirty: true })}
        />

        <div
          id="tour-purchase-rate-status"
          className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <TextInput
            type="number"
            step="any"
            min="0.0001"
            label={`Tasa de Cambio (${activeLocal} / ${activeFunctional})`}
            required
            placeholder="Ej: 45.50"
            leftIcon={<TrendingUp size={18} className="text-blue-500" />}
            error={errors.exchangeRate?.message}
            className="font-mono"
            {...register('exchangeRate', { valueAsNumber: true })}
          />

          <PurchaseStatusPicker
            currentStatus={currentStatus}
            onSelectStatus={(st) => setValue('status', st, { shouldDirty: true })}
          />
        </div>

        <Textarea
          label="Notas / Descripción General (Opcional)"
          rows={2}
          placeholder="Observaciones de recepción, transportista o condiciones de pago..."
          containerClassName="lg:col-span-4"
          {...register('description')}
        />
      </div>
    </div>
  );
}

export default PurchaseHeaderSection;
