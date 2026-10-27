import { useProductFormContext } from '../../../context';
import { StickyBar } from '@/shared/components/ui';

export function ProductFormStickyBar() {
  const {
    isEditing,
    productNameValue,
    isMutating,
    handleCancel,
  } = useProductFormContext();

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
