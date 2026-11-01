import { Receipt } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui';

export interface PurchaseFormHeaderProps {
  isEditMode?: boolean;
  onCancel?: () => void;
  isMutating?: boolean;
}

export function PurchaseFormHeader({
  isEditMode = false,
  onCancel,
  isMutating = false,
}: PurchaseFormHeaderProps) {
  return (
    <FormHeader
      backText="Volver al listado de compras"
      onBack={onCancel}
      icon={<Receipt className="w-5 h-5" />}
      title={isEditMode ? 'Detalle de Compra' : 'Registrar Compra de Materiales'}
      description="Ingreso de comprobante de compra con cálculo detallado de IVA (16%) y emisión de evento para inventario."
      onCancel={onCancel}
      cancelDisabled={isMutating}
      cancelVariant="outline"
      submitText="Guardar Compra"
      isSubmitting={isMutating}
    />
  );
}

export default PurchaseFormHeader;
