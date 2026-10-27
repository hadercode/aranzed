import React, { useId } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';

export interface PaymentReceiptSectionProps {
  receiptUrl: string;
  receiptFileName: string;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveReceipt: () => void;
}

export function PaymentReceiptSection({
  receiptUrl,
  receiptFileName,
  isUploading,
  onFileUpload,
  onRemoveReceipt,
}: PaymentReceiptSectionProps) {
  const inputId = useId();

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Comprobante de Pago Digital
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Adjunta el capture bancario o comprobante emitido (JPG, PNG, WEBP, PDF)
            </p>
          </div>
        </div>

        {receiptUrl && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Adjunto guardado
          </span>
        )}
      </div>

      {!receiptUrl ? (
        <div className="border-2 border-dashed border-[var(--color-border)] hover:border-sage-500/50 rounded-2xl p-6 text-center transition-colors">
          <input
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={onFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label
            htmlFor={inputId}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-sage-500/10 text-sage-600 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {isUploading ? 'Subiendo comprobante al servidor...' : 'Haz clic para seleccionar o arrastra el comprobante'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Formatos permitidos: JPG, PNG, WEBP, PDF (Máximo 10MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 min-w-0">
            {receiptUrl.toLowerCase().endsWith('.pdf') ? (
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={receiptUrl}
                alt="Comprobante"
                className="w-12 h-12 object-cover rounded-lg border border-[var(--color-border)] shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                {receiptFileName || 'comprobante-pago.jpg'}
              </p>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sage-600 hover:underline"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveReceipt}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Quitar comprobante"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
