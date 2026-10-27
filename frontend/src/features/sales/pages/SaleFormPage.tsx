import { SalesFormProvider, useSalesFormContext } from "../context";
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

function SaleFormPageContent() {
  const { loadingInitial, loadError, handleSave } = useSalesFormContext();

  if (loadingInitial) return <SaleFormLoadingState />;
  if (loadError) return <SaleFormErrorState />;

  return (
    <form
      id="sale-form-page"
      onSubmit={handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      <SaleFormHeader />
      <SaleHeaderSection />
      <SaleItemsSection />
      <SaleSummarySection />
      <SaleFormStickyBar />
      <SaleFormFeedback />
    </form>
  );
}

export function SaleFormPage() {
  return (
    <SalesFormProvider>
      <SaleFormPageContent />
    </SalesFormProvider>
  );
}

export default SaleFormPage;
