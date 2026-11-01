import { ShoppingBag } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui/FormHeader';
import type { SaleType } from '../../../types';

export interface SaleFormHeaderProps {
  isEditMode: boolean;
  handleCancel: () => void;
  isSaving: boolean;
  saleType: SaleType;
}

export function SaleFormHeader({
  isEditMode,
  handleCancel,
  isSaving,
  saleType,
}: SaleFormHeaderProps) {
  const title = isEditMode
    ? 'Editar Documento Comercial'
    : saleType === 'QUOTATION'
      ? 'Nueva Cotización de Productos / Servicios'
      : 'Nueva Venta Directa (Facturación)';

  const description =
    saleType === 'QUOTATION'
      ? 'Presupuesto estimativo bimoneda para cliente. No descuenta stock hasta ser convertida o completada.'
      : 'Registro formal de venta con cobro bimoneda. Al completarse, emitirá el evento desacoplado para inventario.';

  return (
    <FormHeader
      backText="Volver al listado de ventas"
      onBack={handleCancel}
      icon={<ShoppingBag className="w-5 h-5" />}
      title={title}
      description={description}
      onCancel={handleCancel}
      cancelDisabled={isSaving}
      submitText={isEditMode ? 'Actualizar Documento' : 'Guardar y Procesar'}
      isSubmitting={isSaving}
    />
  );
}

export default SaleFormHeader;
