import { Package } from 'lucide-react';
import { FormHeader } from '@/shared/components/ui';
import { useProductFormContext } from '../../../context';

export interface ProductFormHeaderProps {
  isEditing?: boolean;
  productName?: string;
  isMutating?: boolean;
  onCancel?: () => void;
}

export function ProductFormHeader({
  isEditing: propIsEditing,
  productName: propProductName,
  isMutating: propIsMutating,
  onCancel: propOnCancel,
}: ProductFormHeaderProps) {
  const context = useProductFormContext();

  const isEditing = propIsEditing ?? context.isEditing;
  const productName =
    propProductName ?? context.product?.name ?? context.productNameValue ?? '';
  const isMutating = propIsMutating ?? context.isMutating;
  const onCancel = propOnCancel ?? context.handleCancel;

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
    />
  );
}

export default ProductFormHeader;
