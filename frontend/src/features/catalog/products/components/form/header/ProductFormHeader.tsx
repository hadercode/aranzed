import { Package } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui';
import { ProductTourLauncher } from '../../tour';

export interface ProductFormHeaderProps {
  isEditing?: boolean;
  productName?: string;
  isMutating?: boolean;
  onCancel?: () => void;
}

export function ProductFormHeader({
  isEditing = false,
  productName = '',
  isMutating = false,
  onCancel,
}: ProductFormHeaderProps) {
  return (
    <FormHeader
      backText="Volver al Catálogo de Productos"
      onBack={onCancel}
      icon={<Package className="w-5 h-5" />}
      title={isEditing ? 'Editar Producto o Servicio' : 'Nuevo Producto o Servicio'}
      description={
        isEditing
          ? `Modificando detalles para "${productName || 'Producto'}"`
          : 'Registra un nuevo artículo en tu catálogo comercial y configura su estructura financiera.'
      }
      onCancel={onCancel}
      cancelDisabled={isMutating}
      submitText={isEditing ? 'Guardar Cambios' : 'Crear Producto'}
      isSubmitting={isMutating}
      submitFormId="product-form-page"
      actions={
        <div className="flex items-center gap-2">
          <ProductTourLauncher variant="button" />
        </div>
      }
    />
  );
}

export default ProductFormHeader;
