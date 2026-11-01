import { useState, useEffect, useMemo } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Copy, Check } from "lucide-react";
import type { Sale } from "../../../types";
import { useCompanyQuery } from "@/features/company/hooks/queries/useCompanyQuery";
import {
  cleanPhoneNumber,
  buildWhatsAppReminderMessage,
} from "../../../utils/saleWhatsAppUtils";
import { WhatsAppFinancialSummaryCards } from "./WhatsAppFinancialSummaryCards";
import { WhatsAppRecipientInput } from "./WhatsAppRecipientInput";
import { WhatsAppMessageEditor } from "./WhatsAppMessageEditor";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppBanner } from "./WhatsAppBanner";

export { WhatsAppIcon };

export interface SaleWhatsAppReminderModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
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

  const companyName = company?.tradeName || company?.legalName || "Nuestra Empresa";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notificación de Cobro por WhatsApp" size="lg">
      <div className="space-y-5 -mt-2">
        <WhatsAppBanner />

        <WhatsAppFinancialSummaryCards sale={sale} reminderData={reminderData} />

        <WhatsAppRecipientInput
          sale={sale}
          phone={phone}
          onChangePhone={setPhone}
          cleanedPhone={cleanedPhone}
        />

        <WhatsAppMessageEditor
          activeMessage={activeMessage}
          onChangeMessage={setEditedMessage}
          onResetMessage={() => setEditedMessage(null)}
        />

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
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
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
