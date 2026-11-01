import { useParams } from 'react-router-dom';
import { useProductFormPage, useProductFormTourAutoStart } from '../hooks';
import {
  ProductFormHeader,
  ProductTypeSection,
  ProductBasicInfoSection,
  ProductClassificationSection,
  ProductPricingSection,
  ProductMediaSection,
  ProductStatusSection,
  ProductFormStickyBar,
  ProductFormFeedback,
  ProductFormLoadingState,
  ProductFormErrorState,
  ProductTourIntroModal,
} from '../components';

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const form = useProductFormPage(id);

  useProductFormTourAutoStart(form.loadingInitial, form.loadError);

  if (form.loadingInitial) {
    return <ProductFormLoadingState />;
  }

  if (form.loadError) {
    return (
      <ProductFormErrorState
        loadError={form.loadError}
        onCancel={form.handleCancel}
        onRetry={() => void form.refetchInitial()}
      />
    );
  }

  return (
    <>
      <form
        id="product-form-page"
        onSubmit={form.handleSave}
        noValidate
        className="max-w-8xl mx-auto pb-24 animate-in fade-in duration-300 space-y-6"
      >
        <ProductFormHeader
          isEditing={form.isEditing}
          productName={form.product?.name ?? form.productNameValue}
          isMutating={form.isMutating}
          onCancel={form.handleCancel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div id="tour-product-type">
              <ProductTypeSection
                selectedType={form.selectedType}
                onSelectType={form.handleTypeSelect}
                error={form.errors.type?.message}
              />
            </div>
            <div id="tour-product-basic-info">
              <ProductBasicInfoSection
                register={form.register}
                errors={form.errors}
                productNameValue={form.productNameValue}
              />
            </div>
            <div id="tour-product-classification">
              <ProductClassificationSection
                register={form.register}
                errors={form.errors}
                uoms={form.uoms}
                categories={form.categories}
              />
            </div>
            <div id="tour-product-pricing">
              <ProductPricingSection
                register={form.register}
                errors={form.errors}
                costValue={form.costValue}
                salePriceValue={form.salePriceValue}
                grossProfit={form.grossProfit}
                profitMarginPercent={form.profitMarginPercent}
                marginOnRevenuePercent={form.marginOnRevenuePercent}
                handleCostChange={form.handleCostChange}
                handleMarginChange={form.handleMarginChange}
                handleSalePriceChange={form.handleSalePriceChange}
              />
            </div>
          </div>

          <div id="tour-product-media-status" className="space-y-6">
            <ProductMediaSection
              register={form.register}
              errors={form.errors}
              setValue={form.setValue}
              imageUrlValue={form.imageUrlValue}
              productNameValue={form.productNameValue}
              uploadProductImage={form.uploadProductImage}
              isUploading={form.isUploading}
              uploadError={form.uploadError}
              clearUploadError={form.clearUploadError}
            />
            <ProductStatusSection
              register={form.register}
              isEditing={form.isEditing}
              product={form.product}
            />
          </div>
        </div>

        <div id="tour-product-sticky-bar">
          <ProductFormStickyBar
            isEditing={form.isEditing}
            productNameValue={form.productNameValue}
            isMutating={form.isMutating}
            handleCancel={form.handleCancel}
          />
        </div>

        <ProductFormFeedback
          isSuccessOpen={form.isSuccessOpen}
          successMessage={form.successMessage}
          closeSuccessDialog={form.closeSuccessDialog}
          mutationError={form.mutationError}
          clearMutationError={form.clearMutationError}
        />
      </form>
      <ProductTourIntroModal />
    </>
  );
}

export default ProductFormPage;
