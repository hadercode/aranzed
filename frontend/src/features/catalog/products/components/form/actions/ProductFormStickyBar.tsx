import { StickyBar } from '@/shared/components/ui';

export interface ProductFormStickyBarProps {
  isEditing?: boolean;
  productNameValue?: string;
  isMutating?: boolean;
  handleCancel?: () => void;
}

export function ProductFormStickyBar({
  isEditing = false,
  productNameValue = '',
  isMutating = false,
  handleCancel,
}: ProductFormStickyBarProps) {
  return (
    <StickyBar
      subtitle="Editando:"
      title={productNameValue || (isEditing ? 'Producto' : 'Nuevo Producto')}
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitText={isEditing ? 'Guardar Cambios' : 'Crear Producto'}
      isSubmitting={isMutating}
      submitFormId="product-form-page"
    />
  );
}

export default ProductFormStickyBar;
