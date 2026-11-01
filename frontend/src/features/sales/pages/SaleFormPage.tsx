import { useSaleFormPage } from "../hooks";
import {
  SaleFormLoadingState,
  SaleFormErrorState,
  SaleFormHeader,
  SaleHeaderSection,
  SaleItemsSection,
  SaleSummarySection,
  SaleFormStickyBar,
  SaleFormFeedback,
} from "../components";

export function SaleFormPage() {
  const formPage = useSaleFormPage();

  if (formPage.loadingInitial) return <SaleFormLoadingState />;
  if (formPage.loadError) {
    return (
      <SaleFormErrorState
        loadError={formPage.loadError}
        handleCancel={formPage.handleCancel}
        refetchInitial={formPage.refetchInitial}
      />
    );
  }

  return (
    <form
      id="sale-form-page"
      onSubmit={formPage.handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      <SaleFormHeader
        isEditMode={formPage.isEditMode}
        handleCancel={formPage.handleCancel}
        isSaving={formPage.isSaving}
        saleType={formPage.form.watch('saleType')}
      />
      <SaleHeaderSection form={formPage.form} />
      <SaleItemsSection
        form={formPage.form}
        sellableProducts={formPage.sellableProducts}
        allProducts={formPage.allProducts}
      />
      <SaleSummarySection form={formPage.form} />
      <SaleFormStickyBar
        isEditMode={formPage.isEditMode}
        isSaving={formPage.isSaving}
        handleCancel={formPage.handleCancel}
        form={formPage.form}
      />
      <SaleFormFeedback
        isSuccessOpen={formPage.isSuccessOpen}
        successMessage={formPage.successMessage}
        handleCloseSuccess={formPage.handleCloseSuccess}
        mutationError={formPage.mutationError}
      />
    </form>
  );
}

export default SaleFormPage;
