import { ProductFormProvider, useProductFormContext } from '../context';
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

function ProductFormPageContent() {
  const { loadingInitial, loadError, handleSave } = useProductFormContext();

  if (loadingInitial) {
    return <ProductFormLoadingState />;
  }

  if (loadError) {
    return <ProductFormErrorState />;
  }

  return (
    <form
      id="product-form-page"
      onSubmit={handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-24 animate-in fade-in duration-300 space-y-6"
    >
      {/* Top Header & Navigation */}
      <ProductFormHeader />

      {/* Main Form Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Types, Info, Catalogs, Pricing */}
        <div className="lg:col-span-2 space-y-6">
          <ProductTypeSection />
          <ProductBasicInfoSection />
          <ProductClassificationSection />
          <ProductPricingSection />
        </div>

        {/* Right Column (1 span): Media/Image & Status/Audit */}
        <div className="space-y-6">
          <ProductMediaSection />
          <ProductStatusSection />
        </div>
      </div>

      {/* Floating Bottom Sticky Bar */}
      <ProductFormStickyBar />

      {/* Feedback Dialogs and Error Alerts */}
      <ProductFormFeedback />
    </form>
  );
}

export function ProductFormPage() {
  return (
    <ProductFormProvider>
      <ProductFormPageContent />
    </ProductFormProvider>
  );
}

export default ProductFormPage;
