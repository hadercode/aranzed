import { DollarSign } from 'lucide-react';
import { StickyBar } from '@/shared/components/ui/StickyBar';
import { useSalesFormContext } from '../../../context';

export function SaleFormStickyBar() {
  const { isEditMode, isSaving, handleCancel, form } = useSalesFormContext();
  const { watch, financials } = form;

  const customerName = watch('customerName') || 'Consumidor Final';
  const saleType = watch('saleType');
  const typeLabel = saleType === 'QUOTATION' ? 'Cotización' : 'Venta Directa';

  return (
    <StickyBar
      title={`${typeLabel}: ${customerName}`}
      subtitle={`Total a Liquidar: $${financials.totalUSD.toFixed(2)} USD (Bs. ${financials.totalLocal.toFixed(2)})`}
      indicators={[
        {
          label: 'Total USD',
          value: `$${financials.totalUSD.toFixed(2)}`,
          icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" />,
          highlight: true,
        },
      ]}
      onCancel={handleCancel}
      cancelDisabled={isSaving}
      submitText={isEditMode ? 'Actualizar Documento' : 'Guardar y Procesar'}
      isSubmitting={isSaving}
      submitFormId="sale-form-page"
    />
  );
}

export default SaleFormStickyBar;
