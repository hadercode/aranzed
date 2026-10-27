import {
  TransactionFormStickyBar,
  TransactionHeaderSection,
  TransactionItemsSection,
  TransactionSummarySection,
} from "../components/form";

import { TransactionFormErrorState } from "../components/form/TransactionFormErrorState";
import { TransactionFormHeader } from "../components/form/TransactionFormHeader";
import { TransactionFormLoadingState } from "../components/form/TransactionFormLoadingState";

import { useTransactionForm } from "../hooks";

export function TransactionFormPage() {
  const formContext = useTransactionForm();
  const { loadingInitial, loadError, handleSubmit, handleCancel } = formContext;

  if (loadingInitial) {
    return <TransactionFormLoadingState />;
  }

  if (loadError) {
    return (
      <TransactionFormErrorState error={loadError} onBack={handleCancel} />
    );
  }

  return (
    <form
      id="inventory-transaction-form"
      onSubmit={handleSubmit}
      noValidate
      className="max-w-8xl mx-auto pb-28 space-y-6 animate-in fade-in duration-300"
    >
      <TransactionFormHeader formContext={formContext} />
      <TransactionHeaderSection formContext={formContext} />
      <TransactionItemsSection formContext={formContext} />
      <TransactionSummarySection formContext={formContext} />
      <TransactionFormStickyBar formContext={formContext} />
    </form>
  );
}

export default TransactionFormPage;
