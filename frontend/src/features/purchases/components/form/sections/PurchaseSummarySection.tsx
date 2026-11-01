import type { UseFormReturn } from "react-hook-form";
import type { PurchaseFormData } from "../../../schemas/purchase.schema";
import type { PurchaseBreakdown } from "../../../types";
import {
  DocumentSummarySection,
  type DocumentSummarySectionProps,
} from "@/shared/components/ui";

export interface PurchaseSummarySectionProps
  extends Partial<DocumentSummarySectionProps> {
  form: UseFormReturn<PurchaseFormData>;
  breakdown: PurchaseBreakdown;
}

export function PurchaseSummarySection({
  form,
  breakdown,
  ...props
}: PurchaseSummarySectionProps) {
  const currentStatus = form.watch("status");
  const exchangeRate =
    props.exchangeRate ??
    (Number(form.watch("exchangeRate")) || breakdown.exchangeRate || 1.0);
  const activeFunctional = form.watch("functionalCurrency");
  const activeLocal = form.watch("localCurrency");
  const documentCurrency =
    form.watch("documentCurrency") || breakdown.documentCurrency;

  return (
    <div id="tour-purchase-summary">
      <DocumentSummarySection
        functionalBreakdown={props.functionalBreakdown ?? breakdown.functional}
        localBreakdown={props.localBreakdown ?? breakdown.local}
        exchangeRate={exchangeRate}
        documentCurrency={props.documentCurrency ?? documentCurrency}
        functionalCurrency={props.functionalCurrency ?? activeFunctional}
        localCurrency={props.localCurrency ?? activeLocal}
        itemsCount={props.itemsCount ?? breakdown.itemsCount}
        totalUnits={props.totalUnits ?? breakdown.totalUnits}
        inventory={{
          moduleType: "purchase",
          status: currentStatus,
          ...props.inventory,
        }}
        className={props.className}
      >
        {props.children}
      </DocumentSummarySection>
    </div>
  );
}

export default PurchaseSummarySection;
