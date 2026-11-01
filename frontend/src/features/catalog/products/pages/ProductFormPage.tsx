import { useParams } from 'react-router-dom';
import { useProductFormPage } from '../hooks';
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
} from '../components';

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const form = useProductFormPage(id);

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
    <form
      id="product-form-page"
      onSubmit={form.handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-24 animate-in fade-in duration-300 space-y-6"
    >
      {/* Top Header & Navigation */}
      <ProductFormHeader
        isEditing={form.isEditing}
        productName={form.product?.name ?? form.productNameValue}
        isMutating={form.isMutating}
        onCancel={form.handleCancel}
      />

      {/* Main Form Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Types, Info, Catalogs, Pricing */}
        <div className="lg:col-span-2 space-y-6">
          <ProductTypeSection
            selectedType={form.selectedType}
            onSelectType={form.handleTypeSelect}
            error={form.errors.type?.message}
          />
          <ProductBasicInfoSection
            register={form.register}
            errors={form.errors}
            productNameValue={form.productNameValue}
          />
          <ProductClassificationSection
            register={form.register}
            errors={form.errors}
            uoms={form.uoms}
            categories={form.categories}
          />
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

        {/* Right Column (1 span): Media/Image & Status/Audit */}
        <div className="space-y-6">
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

      {/* Floating Bottom Sticky Bar */}
      <ProductFormStickyBar
        isEditing={form.isEditing}
        productNameValue={form.productNameValue}
        isMutating={form.isMutating}
        handleCancel={form.handleCancel}
      />

      {/* Feedback Dialogs and Error Alerts */}
      <ProductFormFeedback
        isSuccessOpen={form.isSuccessOpen}
        successMessage={form.successMessage}
        closeSuccessDialog={form.closeSuccessDialog}
        mutationError={form.mutationError}
        clearMutationError={form.clearMutationError}
      />
    </form>
  );
}

export default ProductFormPage;
