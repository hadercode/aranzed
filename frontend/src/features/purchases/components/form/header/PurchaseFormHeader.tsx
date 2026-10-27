import { Receipt } from 'lucide-react';
import { usePurchaseFormContext } from '../../../context';
import { FormHeader } from '@/shared/components/ui';

export function PurchaseFormHeader() {
  const { isEditMode, handleCancel, isMutating } = usePurchaseFormContext();

  return (
    <FormHeader
      backText="Volver al listado de compras"
      onBack={handleCancel}
      icon={<Receipt className="w-5 h-5" />}
      title={isEditMode ? 'Detalle de Compra' : 'Registrar Compra de Materiales'}
      description="Ingreso de comprobante de compra con cálculo detallado de IVA (16%) y emisión de evento para inventario."
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      cancelVariant="outline"
      submitText="Guardar Compra"
      isSubmitting={isMutating}
    />
  );
}

export default PurchaseFormHeader;
