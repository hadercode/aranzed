import { PurchaseFormProvider, usePurchaseFormContext } from "../context";
import {
  PurchaseFormHeader,
  PurchaseHeaderSection,
  PurchaseItemsSection,
  PurchaseSummarySection,
  PurchaseFormStickyBar,
  PurchaseFormLoadingState,
  PurchaseFormErrorState,
} from "../components";

function PurchaseFormPageContent() {
  const { loadingInitial, loadError, handleSave } = usePurchaseFormContext();

  if (loadingInitial) return <PurchaseFormLoadingState />;
  if (loadError) return <PurchaseFormErrorState />;

  return (
    <form
      id="purchase-form-page"
      onSubmit={handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      <PurchaseFormHeader />
      <PurchaseHeaderSection />
      <PurchaseItemsSection />
      <PurchaseSummarySection />
      <PurchaseFormStickyBar />
    </form>
  );
}

export function PurchaseFormPage() {
  return (
    <PurchaseFormProvider>
      <PurchaseFormPageContent />
    </PurchaseFormProvider>
  );
}

export default PurchaseFormPage;
