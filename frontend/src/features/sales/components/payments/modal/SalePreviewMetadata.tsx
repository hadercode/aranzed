import { Calendar, User, Clock } from "lucide-react";
import type { Sale } from "../../../types";

interface SalePreviewMetadataProps {
  sale: Sale;
}

export function SalePreviewMetadata({ sale }: SalePreviewMetadataProps) {
  const isQuotation = sale.saleType === "QUOTATION";

  return (
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
            {sale.paymentTerm === "CREDITO" ? "Crédito Comercial" : "De Contado"}
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
  );
}

