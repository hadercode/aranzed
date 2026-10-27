import { Modal } from '@/shared/components/ui/Modal';
import { Download, ExternalLink } from 'lucide-react';
import { getAssetUrl } from '@/lib/api-client';

export interface ReceiptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string | null;
  receiptUrl?: string | null;
  title?: string;
}

export function ReceiptViewerModal({
  isOpen,
  onClose,
  imageUrl,
  receiptUrl,
  title = 'Comprobante de Pago',
}: ReceiptViewerModalProps) {
  const activeUrl = receiptUrl || imageUrl;
  if (!isOpen || !activeUrl) return null;

  const isPdf = activeUrl.toLowerCase().endsWith('.pdf');
  const fullUrl = getAssetUrl(activeUrl);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-bg)] p-3 rounded-2xl border border-[var(--color-border)]">
          <span>Vista de archivo adjunto</span>
          <div className="flex items-center gap-3">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en nueva pestaña
            </a>
            <a
              href={fullUrl}
              download
              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Descargar
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-black/5 dark:bg-black/30 flex items-center justify-center min-h-[300px] max-h-[550px]">
          {isPdf ? (
            <iframe
              src={fullUrl}
              title="Comprobante PDF"
              className="w-full h-[500px] border-0"
            />
          ) : (
            <img
              src={fullUrl}
              alt="Comprobante de pago"
              className="max-h-[500px] max-w-full object-contain mx-auto"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
