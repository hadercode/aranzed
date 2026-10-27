import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, Trash2, Calendar, FileText } from "lucide-react";
import { PurchasesStatusBadge } from "../../components/table/PurchasesStatusBadge";
import { type DataTableColumn } from "@/shared/components/ui";
import { useCurrencyStore } from "@/shared/hooks/store";
import { usePurchasesContext } from "../../context";
import type { Purchase } from "../../types";

export interface UsePurchasesTableColumnsOptions {
  openCompleteModal?: (purchase: Purchase) => void;
  openDeleteModal?: (purchase: Purchase) => void;
}

export function usePurchasesTableColumns(
  options?: UsePurchasesTableColumnsOptions,
) {
  const navigate = useNavigate();
  const context = usePurchasesContext();

  const openCompleteModal =
    options?.openCompleteModal ?? context.openCompleteModal;
  const openDeleteModal = options?.openDeleteModal ?? context.openDeleteModal;

  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } =
    useCurrencyStore();

  const columns: DataTableColumn<Purchase>[] = useMemo(
    () => [
      {
        key: "purchaseNumber",
        title: "N° Compra",
        sortable: true,
        render: (purchase) => {
          const isDocLocal =
            purchase.documentCurrency ===
            (purchase.localCurrency || localCurrency);
          return (
            <div className="font-mono text-xs">
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                {purchase.purchaseNumber}
              </div>
              <span
                className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  isDocLocal
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                    : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                Factura{" "}
                {isDocLocal
                  ? `${localSymbol} (${localCurrency})`
                  : `${functionalSymbol} (${functionalCurrency})`}
              </span>
            </div>
          );
        },
      },
      {
        key: "supplierName",
        title: "Proveedor",
        sortable: true,
        render: (purchase) => (
          <div>
            <span className="font-medium text-[var(--color-text-primary)]">
              {purchase.supplierName}
            </span>
            {purchase.description && (
              <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">
                {purchase.description}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "invoiceNumber",
        title: "N° Factura",
        sortable: true,
        render: (purchase) => (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-mono">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            {purchase.invoiceNumber || "—"}
          </span>
        ),
      },
      {
        key: "purchaseDate",
        title: "Fecha",
        sortable: true,
        render: (purchase) => {
          const formattedDate = new Date(
            purchase.purchaseDate,
          ).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
          return (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          );
        },
      },
      {
        key: "exchangeRate",
        title: `Tasa (${localSymbol}/${functionalSymbol})`,
        align: "center",
        sortable: true,
        render: (purchase) => {
          const rate = Number(purchase.exchangeRate) || 1.0;
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400">
              {rate.toLocaleString("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </span>
          );
        },
      },
      {
        key: "items",
        title: "Materiales",
        align: "center",
        render: (purchase) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 text-[var(--color-text-secondary)]">
            {purchase.items?.length || 0} ítems
          </span>
        ),
      },
      {
        key: "subtotal",
        title: `Subtotal (${functionalSymbol} / ${localSymbol})`,
        align: "right",
        sortable: true,
        render: (purchase) => {
          const rate = Number(purchase.exchangeRate) || 1.0;
          const subtotalLocal =
            purchase.subtotalLocal !== undefined
              ? Number(purchase.subtotalLocal)
              : Number(purchase.subtotal) * rate;

          return (
            <div className="text-xs font-mono">
              <div>
                {functionalSymbol}{" "}
                {Number(purchase.subtotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400">
                {localSymbol}{" "}
                {subtotalLocal.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        },
      },
      {
        key: "taxAmount",
        title: `IVA (${functionalSymbol} / ${localSymbol})`,
        align: "right",
        sortable: true,
        render: (purchase) => {
          const rate = Number(purchase.exchangeRate) || 1.0;
          const taxAmountLocal =
            purchase.taxAmountLocal !== undefined
              ? Number(purchase.taxAmountLocal)
              : Number(purchase.taxAmount) * rate;

          return (
            <div className="text-xs font-mono text-[var(--color-text-secondary)]">
              <div>
                {functionalSymbol}{" "}
                {Number(purchase.taxAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400">
                {localSymbol}{" "}
                {taxAmountLocal.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        },
      },
      {
        key: "total",
        title: `Total (${functionalSymbol} / ${localSymbol})`,
        align: "right",
        sortable: true,
        render: (purchase) => {
          const rate = Number(purchase.exchangeRate) || 1.0;
          const totalLocal =
            purchase.totalLocal !== undefined
              ? Number(purchase.totalLocal)
              : Number(purchase.total) * rate;

          return (
            <div className="font-mono">
              <div className="font-bold text-sm text-[var(--color-text-primary)]">
                {functionalSymbol}{" "}
                {Number(purchase.total).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                {localSymbol}{" "}
                {totalLocal.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        title: "Estado",
        align: "center",
        sortable: true,
        render: (purchase) => <PurchasesStatusBadge status={purchase.status} />,
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (purchase) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`/purchases/${purchase.id}`)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
              title="Ver detalle de la compra"
            >
              <Eye className="w-4 h-4" />
            </button>

            {purchase.status === "DRAFT" && (
              <button
                type="button"
                onClick={() => openCompleteModal(purchase)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                title="Completar compra (Emite evento para stock)"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </button>
            )}

            {purchase.status === "DRAFT" && (
              <button
                type="button"
                onClick={() => openDeleteModal(purchase)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                title="Eliminar borrador"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [
      functionalCurrency,
      functionalSymbol,
      localCurrency,
      localSymbol,
      navigate,
      openCompleteModal,
      openDeleteModal,
    ],
  );

  return columns;
}

export default usePurchasesTableColumns;
