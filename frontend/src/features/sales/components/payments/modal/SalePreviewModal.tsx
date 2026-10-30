import { Printer, X, DollarSign, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { SaleTypeBadge } from "../../table/SaleTypeBadge";
import { SalesStatusBadge } from "../../table/SalesStatusBadge";
import { SalesPaidBadge } from "../../table/SalesPaidBadge";
import type { Sale } from "../../../types";
import { WhatsAppIcon } from "./SaleWhatsAppReminderModal";

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
    (sale.paidStatus !== "PAGADO" ||
      (sale.balance !== undefined && sale.balance > 0));

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
                {!isQuotation && (
                  <SalesPaidBadge paidStatus={sale.paidStatus} />
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {isQuotation
                  ? "Presupuesto comercial informativo"
                  : "Comprobante de venta"}
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
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--color-surface-bg)] p-4 rounded-2xl border border-[var(--color-border)]">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Datos del Cliente
              </span>
              <p className="font-bold text-[var(--color-text-primary)] text-base">
                {sale.customerName}
              </p>
              {sale.customerTaxId && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Doc / RIF:{" "}
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {sale.customerTaxId}
                  </span>
                </p>
              )}
              {sale.customerPhone && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Teléfono: {sale.customerPhone}
                </p>
              )}
              {sale.customerEmail && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Email: {sale.customerEmail}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Condiciones y Fecha
              </span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Condición:{" "}
                <span
                  className={`font-semibold ${
                    sale.paymentTerm === "CREDITO"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {sale.paymentTerm === "CREDITO"
                    ? "Crédito Comercial"
                    : "De Contado"}
                </span>
              </p>
              {sale.paymentTerm === "CREDITO" && sale.dueDate && (
                <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Vencimiento:{" "}
                  {new Date(sale.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-xs text-[var(--color-text-secondary)]">
                Fecha Emisión:{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {new Date(sale.saleDate).toLocaleDateString()}
                </span>
              </p>
              {isQuotation && sale.validUntil && (
                <p className="text-xs text-amber-600 font-semibold">
                  Válido Hasta: {new Date(sale.validUntil).toLocaleDateString()}
                </p>
              )}
              <p className="text-xs text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-semibold">
                Tasa de Cambio: 1 USD = {sale.exchangeRate.toFixed(4)} VES
              </p>
            </div>
          </div>

          {/* Tabla de ítems */}
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-3 text-sm">
              Productos y Servicios en Detalle ({sale.items?.length || 0})
            </h3>
            <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Descripción</th>
                    <th className="py-2.5 px-3 text-center">Cant.</th>
                    <th className="py-2.5 px-3 text-right">Precio USD</th>
                    <th className="py-2.5 px-3 text-center">Desc.</th>
                    <th className="py-2.5 px-3 text-center">IVA</th>
                    <th className="py-2.5 px-3 text-right">Total USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {(sale.items || []).map((it, idx) => (
                    <tr
                      key={it.id || idx}
                      className="hover:bg-[var(--color-surface-bg)]/50"
                    >
                      <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-medium text-[var(--color-text-primary)]">
                        {it.description}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">
                        {it.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        ${it.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-500">
                        {it.discountRate > 0 ? `${it.discountRate}%` : "-"}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-500">
                        {it.isTaxable ? `${it.taxRate}%` : "Exento"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[var(--color-text-primary)]">
                        ${it.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen bimoneda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-1">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                Notas u Observaciones
              </span>
              <p className="text-xs text-[var(--color-text-primary)] italic">
                {sale.notes ||
                  "Sin notas adicionales registradas en este documento."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--color-surface-card)] to-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-2">
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>Subtotal Base:</span>
                <span className="font-medium">${sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-rose-600">
                  <span>Descuentos:</span>
                  <span className="font-semibold">
                    -${sale.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
                <span>IVA Estimado:</span>
                <span className="font-medium">
                  ${sale.taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[var(--color-text-primary)]">
                  TOTAL USD:
                </span>
                <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                  ${sale.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  TOTAL VES:
                </span>
                <span className="font-bold text-sm text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]">
                  Bs. {sale.totalLocal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
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
