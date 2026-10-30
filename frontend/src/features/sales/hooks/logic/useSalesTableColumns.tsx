import { useMemo } from "react";
import type { Sale } from "../../types";
import type { Column } from "@/shared/components/ui/Table";
import { SaleTypeBadge } from "../../components/table/SaleTypeBadge";
import {
  SalesStatusBadge,
  SalesPaidBadge,
  SaleRowActionsDropdown,
} from "../../components/table";

export interface UseSalesTableColumnsProps {
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

export function useSalesTableColumns({
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
}: UseSalesTableColumnsProps): Column<Sale>[] {
  return useMemo(
    () => [
      {
        key: "saleNumber",
        title: "N° Documento",
        render: (sale: Sale) => (
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--color-text-primary)]">
              {sale.saleNumber}
            </span>
            {sale.convertedFromQuotationId && (
              <span className="text-[10px] text-[var(--color-text-muted)] italic">
                Desde cotización
              </span>
            )}
          </div>
        ),
      },
      {
        key: "saleType",
        title: "Tipo",
        render: (sale: Sale) => <SaleTypeBadge type={sale.saleType} />,
      },
      {
        key: "paymentTerm",
        title: "Condición",
        render: (sale: Sale) => {
          const isCredit = sale.paymentTerm === "CREDITO";
          return (
            <div className="flex flex-col text-xs">
              <span
                className={`font-semibold text-xs ${
                  isCredit
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isCredit ? "Crédito" : "Contado"}
              </span>
              {isCredit && sale.dueDate && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Vence: {new Date(sale.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "saleDate",
        title: "Fecha",
        render: (sale: Sale) => (
          <div className="flex flex-col text-xs text-[var(--color-text-secondary)]">
            <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
            {sale.saleType === "QUOTATION" && sale.validUntil && (
              <span className="text-[10px] text-amber-600 font-medium">
                Vence: {new Date(sale.validUntil).toLocaleDateString()}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "customerName",
        title: "Cliente",
        render: (sale: Sale) => (
          <div className="flex flex-col max-w-[180px] truncate">
            <span className="font-medium text-xs text-[var(--color-text-primary)] truncate">
              {sale.customerName}
            </span>
            {sale.customerTaxId && (
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {sale.customerTaxId}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "total",
        title: "Importe Total",
        align: "right",
        render: (sale: Sale) => (
          <div className="flex flex-col items-end">
            <span className="font-bold text-sm text-[var(--color-text-primary)]">
              ${sale.total.toFixed(2)}
            </span>
            <span className="text-[11px] text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-medium">
              Bs. {sale.totalLocal.toFixed(2)}
            </span>
          </div>
        ),
      },
      {
        key: "paidStatus",
        title: "Estado Pago",
        align: "center",
        render: (sale: Sale) => {
          if (sale.saleType === "QUOTATION") {
            return (
              <span className="text-xs text-[var(--color-text-muted)] italic">
                N/A
              </span>
            );
          }
          return (
            <div className="flex items-center justify-center gap-1.5">
              <SalesPaidBadge paidStatus={sale.paidStatus} />
            </div>
          );
        },
      },
      {
        key: "status",
        title: "Estado Doc.",
        align: "center",
        render: (sale: Sale) => <SalesStatusBadge status={sale.status} />,
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (sale: Sale) => (
          <SaleRowActionsDropdown
            sale={sale}
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
          />
        ),
      },
    ],
    [
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
    ],
  );
}
