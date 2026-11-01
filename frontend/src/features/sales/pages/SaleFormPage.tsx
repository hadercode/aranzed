import { useEffect } from "react";
import { useSaleFormPage, useSaleTour } from "../hooks";
import { useSaleTourStore } from "../store";
import {
  SaleFormLoadingState,
  SaleFormErrorState,
  SaleFormHeader,
  SaleHeaderSection,
  SaleItemsSection,
  SaleSummarySection,
  SaleFormStickyBar,
  SaleFormFeedback,
  SaleTourIntroModal,
} from "../components";

export function SaleFormPage() {
  const formPage = useSaleFormPage();
  const { startInteractiveTour } = useSaleTour();
  const { shouldAutoStartTour, setShouldAutoStartTour } = useSaleTourStore();

  useEffect(() => {
    if (!formPage.loadingInitial && !formPage.loadError && shouldAutoStartTour) {
      setShouldAutoStartTour(false);
      const timer = setTimeout(() => {
        startInteractiveTour();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [
    formPage.loadingInitial,
    formPage.loadError,
    shouldAutoStartTour,
    setShouldAutoStartTour,
    startInteractiveTour,
  ]);

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
    <>
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
      <SaleTourIntroModal />
    </>
  );
}

export default SaleFormPage;
