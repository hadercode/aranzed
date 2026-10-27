import { usePurchaseFormContext } from "../../../context";
import {
  DocumentSummarySection,
  type DocumentSummarySectionProps,
} from "@/shared/components/ui";

export interface PurchaseSummarySectionProps
  extends Partial<DocumentSummarySectionProps> {}

/**
 * Sección de Liquidación y Resumen Financiero para Compras.
 * Consume reactivamente usePurchaseFormContext y delega la renderización
 * al componente global compartido DocumentSummarySection.
 */
export function PurchaseSummarySection(props: PurchaseSummarySectionProps = {}) {
  const { breakdown, form } = usePurchaseFormContext();

  const currentStatus = form.watch("status");
  const exchangeRate =
    props.exchangeRate ??
    (Number(form.watch("exchangeRate")) || breakdown.exchangeRate || 1.0);
  const activeFunctional = form.watch("functionalCurrency");
  const activeLocal = form.watch("localCurrency");
  const documentCurrency =
    form.watch("documentCurrency") || breakdown.documentCurrency;

  return (
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
  );
}

export default PurchaseSummarySection;
