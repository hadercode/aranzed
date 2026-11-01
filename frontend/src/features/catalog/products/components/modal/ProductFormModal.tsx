import { Save } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import { useProductsStore } from '../../store';
import {
  useProductsQuery,
  useProductsMutations,
  useProductsModals,
  useProductForm,
} from '../../hooks';
import { ProductModalTypeSelector } from './ProductModalTypeSelector';
import { ProductModalGeneralFields } from './ProductModalGeneralFields';
import { ProductModalImageUploader } from './ProductModalImageUploader';
import { ProductModalPricing } from './ProductModalPricing';
import { ProductModalFlags } from './ProductModalFlags';

export function ProductFormModal() {
  const { isFormModalOpen, editingProduct, closeFormModal, showSuccess } = useProductsStore();
  const { uoms, categories, refetch } = useProductsQuery();

  const {
    createProduct,
    updateProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useProductsMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  const { handleSaveProduct } = useProductsModals({
    createProduct,
    updateProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    clearMutationError,
    onSuccess: showSuccess,
  });

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
    handleTypeSelect,
  } = useProductForm({
    editingProduct,
    uoms,
    onSubmit: handleSaveProduct,
  });

  const selectedType = watch('type');
  const imageUrlValue = watch('imageUrl');

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={closeFormModal}
      title={editingProduct ? 'Editar Producto o Servicio' : 'Nuevo Producto o Servicio'}
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {mutationError && (
          <div className="p-3.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {mutationError}
          </div>
        )}

        <ProductModalTypeSelector
          selectedType={selectedType}
          onSelectType={handleTypeSelect}
          error={errors.type?.message}
        />

        <ProductModalGeneralFields
          register={register}
          errors={errors}
          uoms={uoms}
          categories={categories}
        />

        <ProductModalImageUploader
          imageUrlValue={imageUrlValue}
          register={register}
          errors={errors}
          setValue={setValue}
          uploadProductImage={uploadProductImage}
          isUploading={isUploading}
          uploadError={uploadError}
          clearUploadError={clearUploadError}
        />

        <ProductModalPricing
          register={register}
          errors={errors}
          handleCostChange={handleCostChange}
          handleMarginChange={handleMarginChange}
          handleSalePriceChange={handleSalePriceChange}
        />

        <ProductModalFlags register={register} />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
          <Button type="button" variant="secondary" onClick={closeFormModal} disabled={isMutating}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isMutating} leftIcon={<Save className="w-4 h-4" />}>
            {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
