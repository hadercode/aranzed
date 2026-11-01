import React, { useId } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { getAssetUrl } from '@/lib/api-client';

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
  const fullAssetUrl = getAssetUrl(receiptUrl);

  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
                Comprobante de Pago
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Almacenamiento seguro en la nube
              </p>
            </div>
          </div>

          {receiptUrl && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              S3 Listo
            </span>
          )}
        </div>

        {!receiptUrl ? (
          <div className="border-2 border-dashed border-[var(--color-border)] hover:border-purple-500/50 hover:bg-purple-500/5 rounded-2xl p-4 sm:p-5 text-center transition-all flex flex-col items-center justify-center min-h-[140px]">
            <input
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor={inputId}
              className="cursor-pointer flex flex-col items-center gap-2 w-full"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  {isUploading ? 'Subiendo comprobante a Neon S3...' : 'Seleccionar o arrastrar comprobante'}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                  JPG, PNG, WEBP (Hasta 10MB)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={fullAssetUrl}
                alt="Comprobante"
                className="w-12 h-12 rounded-lg object-cover border border-[var(--color-border)] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                  {receiptFileName || 'Comprobante cargado'}
                </p>
                <a
                  href={fullAssetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline inline-block mt-0.5"
                >
                  Ver imagen original
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveReceipt}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors ml-2 shrink-0"
              title="Quitar comprobante"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-text-muted)] text-center pt-2">
        Soporte para auditoría fiscal y conciliación bancaria
      </p>
    </div>
  );
}
