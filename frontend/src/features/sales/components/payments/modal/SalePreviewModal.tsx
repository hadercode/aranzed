import { Printer, X, DollarSign } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { SaleTypeBadge } from "../../table/SaleTypeBadge";
import { SalesStatusBadge } from "../../table/SalesStatusBadge";
import { SalesPaidBadge } from "../../table/SalesPaidBadge";
import type { Sale } from "../../../types";
import { WhatsAppIcon } from "./SaleWhatsAppReminderModal";
import { SalePreviewMetadata } from "./SalePreviewMetadata";
import { SalePreviewItemsTable } from "./SalePreviewItemsTable";
import { SalePreviewSummary } from "./SalePreviewSummary";

export interface SalePreviewModalProps {
  sale: Sale | null;
  onClose: () => void;
  onPrint: (sale: Sale) => void;
  onWhatsAppReminder?: (sale: Sale) => void;
}

export function SalePreviewModal({
  sale,
  onClose,
  onPrint,
  onWhatsAppReminder,
}: SalePreviewModalProps) {
  if (!sale) return null;

  const isQuotation = sale.saleType === "QUOTATION";
  const isCancelled = sale.status === "CANCELLED";
  const hasPendingBalance =
    !isQuotation &&
    !isCancelled &&
    (sale.paidStatus !== "PAGADO" || (sale.balance !== undefined && sale.balance > 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface-card)] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[var(--color-border)] overflow-hidden">
        {/* Cabecera del Comprobante */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {sale.saleNumber}
                </h2>
                <SaleTypeBadge type={sale.saleType} />
                <SalesStatusBadge status={sale.status} />
                {!isQuotation && <SalesPaidBadge paidStatus={sale.paidStatus} />}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isQuotation ? "Presupuesto comercial informativo" : "Comprobante de venta"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasPendingBalance && onWhatsAppReminder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onWhatsAppReminder(sale);
                }}
                className="text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                leftIcon={<WhatsAppIcon className="w-4 h-4 text-emerald-600" />}
              >
                Cobro WhatsApp
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrint(sale)}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Imprimir PDF
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          <SalePreviewMetadata sale={sale} />
          <SalePreviewItemsTable items={sale.items} />
          <SalePreviewSummary sale={sale} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-surface-bg)]">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SalePreviewModal;
