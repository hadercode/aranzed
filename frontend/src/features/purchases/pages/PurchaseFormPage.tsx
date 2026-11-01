import { usePurchaseFormPage } from "../hooks";
import {
  PurchaseFormHeader,
  PurchaseHeaderSection,
  PurchaseItemsSection,
  PurchaseSummarySection,
  PurchaseFormStickyBar,
  PurchaseFormLoadingState,
  PurchaseFormErrorState,
} from "../components";

export function PurchaseFormPage() {
  const formState = usePurchaseFormPage();

  if (formState.loadingInitial) return <PurchaseFormLoadingState />;
  if (formState.loadError) {
    return (
      <PurchaseFormErrorState
        loadError={formState.loadError}
        onCancel={formState.handleCancel}
        onRetry={() => void formState.refetchInitial()}
      />
    );
  }

  return (
    <form
      id="purchase-form-page"
      onSubmit={formState.handleSave}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      <PurchaseFormHeader
        isEditMode={formState.isEditMode}
        onCancel={formState.handleCancel}
        isMutating={formState.isMutating}
      />
      <PurchaseHeaderSection form={formState.form} />
      <PurchaseItemsSection
        form={formState.form}
        formItems={formState.formItems}
        rawMaterials={formState.rawMaterials}
      />
      <PurchaseSummarySection
        form={formState.form}
        breakdown={formState.breakdown}
      />
      <PurchaseFormStickyBar
        form={formState.form}
        breakdown={formState.breakdown}
        isMutating={formState.isMutating}
        onCancel={formState.handleCancel}
      />
    </form>
  );
}

export default PurchaseFormPage;
