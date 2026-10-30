import { useState, useEffect, useMemo } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import {
  Calendar,
  Clock,
  Copy,
  Check,
  User,
  AlertTriangle,
  RotateCcw,
  DollarSign,
} from "lucide-react";
import type { Sale } from "../../../types";
import { useCompanyQuery } from "@/features/company/hooks/queries/useCompanyQuery";
import {
  cleanPhoneNumber,
  buildWhatsAppReminderMessage,
} from "../../../utils/saleWhatsAppUtils";

export interface SaleWhatsAppReminderModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function SaleWhatsAppReminderModal({
  sale,
  isOpen,
  onClose,
}: SaleWhatsAppReminderModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <SaleWhatsAppReminderModalContent
      key={sale.id}
      sale={sale}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}

function SaleWhatsAppReminderModalContent({
  sale,
  isOpen,
  onClose,
}: {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: company, refetch: fetchCompany } = useCompanyQuery();
  const [phone, setPhone] = useState(sale.customerPhone || "");
  const [editedMessage, setEditedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const companyName =
    company?.tradeName || company?.legalName || "Nuestra Empresa";

  const reminderData = useMemo(() => {
    return buildWhatsAppReminderMessage({ sale, companyName });
  }, [sale, companyName]);

  const activeMessage = editedMessage ?? reminderData.message;

  const cleanedPhone = cleanPhoneNumber(phone);
  const isValidPhone = cleanedPhone.length >= 7;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(activeMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!isValidPhone) return;
    const encoded = encodeURIComponent(activeMessage);
    const url = `https://wa.me/${cleanedPhone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleResetMessage = () => {
    setEditedMessage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notificación de Cobro por WhatsApp"
      size="lg"
    >
      <div className="space-y-5 -mt-2">
        {/* Cabecera descriptiva */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <WhatsAppIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-emerald-950 dark:text-emerald-200">
              Recordatorio cordial de cobranza
            </p>
            <p className="mt-0.5 opacity-90">
              Genera y envía un mensaje personalizado al cliente con el saldo
              pendiente, fecha de vencimiento y cálculo automático de días de
              antigüedad.
            </p>
          </div>
        </div>

        {/* Tarjetas de Resumen Financiero y Vencimiento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Monto Pendiente */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Monto Pendiente</span>
            </div>
            <div className="font-bold text-base text-[var(--color-text-primary)]">
              {reminderData.formattedUSD}
            </div>
            {reminderData.formattedVES && (
              <div className="text-xs text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] font-medium">
                {reminderData.formattedVES}
              </div>
            )}
          </div>

          {/* Fecha de Vencimiento */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Vencimiento</span>
            </div>
            <div className="font-bold text-sm text-[var(--color-text-primary)]">
              {reminderData.dueDateFormatted}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)]">
              {sale.paymentTerm === "CREDITO" ? "Venta a Crédito" : "Condición Contado"}
            </div>
          </div>

          {/* Días de Antigüedad / Estado */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Antigüedad / Estado</span>
            </div>
            {sale.dueDate ? (
              reminderData.isOverdue ? (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Vencida hace {reminderData.daysOverdue} d</span>
                </div>
              ) : reminderData.daysOverdue === 0 ? (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  <span>Vence hoy</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <span>En plazo ({Math.abs(reminderData.daysOverdue)} d restantes)</span>
                </div>
              )
            ) : (
              <span className="text-xs text-[var(--color-text-muted)] italic">
                Pendiente de cobro
              </span>
            )}
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1 truncate">
              Doc: #{sale.saleNumber}
            </div>
          </div>
        </div>

        {/* Datos del Cliente y Teléfono */}
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
                onChange={(e) => setPhone(e.target.value)}
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

        {/* Editor / Vista previa del Mensaje Cordial */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[var(--color-text-primary)]">
              Mensaje cordial a enviar (editable):
            </label>
            <button
              type="button"
              onClick={handleResetMessage}
              className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] hover:text-emerald-600 transition-colors cursor-pointer"
              title="Restablecer mensaje predeterminado"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer texto</span>
            </button>
          </div>
          <textarea
            rows={8}
            value={activeMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full p-3.5 text-xs rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed font-sans resize-y"
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--color-border)]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopyMessage}
              leftIcon={
                copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )
              }
            >
              {copied ? "¡Copiado!" : "Copiar Mensaje"}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!isValidPhone}
              onClick={handleOpenWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border-transparent"
              leftIcon={<WhatsAppIcon className="w-4 h-4" />}
            >
              Enviar por WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SaleWhatsAppReminderModal;
