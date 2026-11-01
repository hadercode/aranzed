import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import type { Sale } from "../../types";
import { checkIsSaleOverdue } from "../../utils/saleWhatsAppUtils";
import { useDropdownPosition } from "./useDropdownPosition";
import { SaleRowActionsMenu } from "./SaleRowActionsMenu";

export interface SaleRowActionsDropdownProps {
  sale: Sale;
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
}

export function SaleRowActionsDropdown({
  sale,
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
}: SaleRowActionsDropdownProps) {
  const {
    isOpen,
    coords,
    triggerRef,
    menuRef,
    toggleDropdown,
    closeDropdown,
  } = useDropdownPosition(360);
  const [isOverdue, setIsOverdue] = useState(false);

  const isQuotation = sale.saleType === "QUOTATION";
  const isCancelled = sale.status === "CANCELLED";
  const hasPendingBalance =
    !isQuotation &&
    !isCancelled &&
    (sale.paidStatus !== "PAGADO" || (sale.balance !== undefined && sale.balance > 0));

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOverdue(checkIsSaleOverdue(sale, hasPendingBalance));
    }
    toggleDropdown();
  };

  const executeAction = (action: () => void) => {
    closeDropdown();
    action();
  };

  return (
    <div className="relative inline-block text-right">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all select-none ${
          isOpen
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 ring-2 ring-emerald-500/20"
            : "bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-[var(--color-border)] shadow-2xs hover:shadow-xs"
        }`}
        title="Opciones y acciones del documento"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span>Acciones</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        coords &&
        createPortal(
          <SaleRowActionsMenu
            sale={sale}
            coords={coords}
            menuRef={menuRef}
            isOverdue={isOverdue}
            onPreview={onPreview}
            onPrint={onPrint}
            onWhatsAppReminder={onWhatsAppReminder}
            onEdit={onEdit}
            onConfirm={onConfirm}
            onConvert={onConvert}
            onCancel={onCancel}
            onDelete={onDelete}
            onOpenQuickPayment={onOpenQuickPayment}
            onOpenCloseManual={onOpenCloseManual}
            onOpenPaymentsHistory={onOpenPaymentsHistory}
            onExecute={executeAction}
          />,
          document.body
        )}
    </div>
  );
}

export default SaleRowActionsDropdown;
