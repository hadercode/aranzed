import { FileText, Printer } from "lucide-react";
import type { Sale } from "../../types";
import { SalePaymentActions } from "./SalePaymentActions";
import { SaleAdminActions } from "./SaleAdminActions";
import type { DropdownCoords } from "./useDropdownPosition";

interface SaleRowActionsMenuProps {
  sale: Sale;
  coords: DropdownCoords;
  menuRef: React.RefObject<HTMLDivElement | null>;
  isOverdue: boolean;
  onPreview: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
  onWhatsAppReminder: (sale: Sale) => void;
  onEdit: (id: string) => void;
  onConfirm: (sale: Sale) => void;
  onConvert: (sale: Sale) => void;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onOpenQuickPayment?: (sale: Sale) => void;
  onOpenCloseManual?: (sale: Sale) => void;
  onOpenPaymentsHistory?: (sale: Sale) => void;
  onExecute: (action: () => void) => void;
}

export function SaleRowActionsMenu({
  sale,
  coords,
  menuRef,
  isOverdue,
  onPreview,
  onPrint,
  onWhatsAppReminder,
  onEdit,
  onConfirm,
  onConvert,
  onCancel,
  onDelete,
  onOpenQuickPayment,
  onOpenCloseManual,
  onOpenPaymentsHistory,
  onExecute,
}: SaleRowActionsMenuProps) {
  const isQuotation = sale.saleType === "QUOTATION";
  const isCompleted = sale.status === "COMPLETED";
  const isCancelled = sale.status === "CANCELLED";
  const hasPendingBalance =
    !isQuotation &&
    !isCancelled &&
    (sale.paidStatus !== "PAGADO" || (sale.balance !== undefined && sale.balance > 0));

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: coords.openUp ? undefined : `${coords.top}px`,
        bottom: coords.openUp ? `${coords.bottom}px` : undefined,
        right: `${coords.right}px`,
        zIndex: 9999,
      }}
      className="w-64 max-h-[85vh] overflow-y-auto bg-[var(--color-surface-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] py-1.5 text-xs text-[var(--color-text-primary)] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3.5 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-bg)]/60">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[var(--color-text-primary)] font-mono text-[11px]">
            {sale.saleNumber}
          </span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              isQuotation
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isQuotation ? "Cotización" : "Venta"}
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
          {sale.customerName}
        </p>
      </div>

      <div className="py-1">
        <button
          type="button"
          onClick={() => onExecute(() => onPreview(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Ver Comprobante / Detalle</span>
        </button>
        <button
          type="button"
          onClick={() => onExecute(() => onPrint(sale))}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <Printer className="w-4 h-4 text-purple-500 shrink-0" />
          <span>Imprimir PDF</span>
        </button>
      </div>

      <div className="border-t border-[var(--color-border)] my-1" />

      <SalePaymentActions
        sale={sale}
        hasPendingBalance={hasPendingBalance}
        isOverdue={isOverdue}
        isQuotation={isQuotation}
        isCompleted={isCompleted}
        isCancelled={isCancelled}
        onExecute={onExecute}
        onWhatsAppReminder={onWhatsAppReminder}
        onOpenQuickPayment={onOpenQuickPayment}
        onOpenPaymentsHistory={onOpenPaymentsHistory}
        onOpenCloseManual={onOpenCloseManual}
        onConvert={onConvert}
        onConfirm={onConfirm}
      />

      <div className="border-t border-[var(--color-border)] my-1" />

      <SaleAdminActions
        sale={sale}
        isCompleted={isCompleted}
        isCancelled={isCancelled}
        onExecute={onExecute}
        onEdit={onEdit}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </div>
  );
}

