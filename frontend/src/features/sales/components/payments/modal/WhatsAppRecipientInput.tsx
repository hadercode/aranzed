import { User } from "lucide-react";
import type { Sale } from "../../../types";

interface WhatsAppRecipientInputProps {
  sale: Sale;
  phone: string;
  onChangePhone: (phone: string) => void;
  cleanedPhone: string;
}

export function WhatsAppRecipientInput({
  sale,
  phone,
  onChangePhone,
  cleanedPhone,
}: WhatsAppRecipientInputProps) {
  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400" /> {sale.customerName}
        </span>
        {sale.customerTaxId && (
          <span className="text-[var(--color-text-muted)]">
            RIF/Doc: {sale.customerTaxId}
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
          Número de WhatsApp del destinatario:
        </label>
        <div className="relative">
          <input
            type="text"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="Ej. +58 414 1234567 o 04141234567"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px]">
          {cleanedPhone ? (
            <span className="text-[var(--color-text-muted)] font-mono">
              Enlace wa.me: +{cleanedPhone}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Por favor ingresa el número con código de país para enviar directamente.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

