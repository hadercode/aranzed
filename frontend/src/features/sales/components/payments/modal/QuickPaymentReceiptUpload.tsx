import { Upload, X } from "lucide-react";
import { getAssetUrl } from "@/lib/api-client";

interface QuickPaymentReceiptUploadProps {
  fileInputId: string;
  receiptUrl: string | null;
  receiptFileName?: string | null;
  isUploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveReceipt: () => void;
}

export function QuickPaymentReceiptUpload({
  fileInputId,
  receiptUrl,
  receiptFileName,
  isUploading,
  onFileUpload,
  onRemoveReceipt,
}: QuickPaymentReceiptUploadProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">
          Comprobante / Capture (Opcional)
        </label>
        {receiptUrl && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Almacenado en Neon S3
          </span>
        )}
      </div>
      {!receiptUrl ? (
        <div className="border border-dashed border-[var(--color-border)] hover:border-sage-500/50 rounded-xl p-3 text-center transition-colors">
          <input
            id={fileInputId}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label
            htmlFor={fileInputId}
            className="cursor-pointer flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <Upload className="w-4 h-4 text-sage-600" />
            <span>
              {isUploading
                ? "Subiendo imagen a Neon S3..."
                : "Adjuntar capture bancario (JPG, PNG, WEBP - Hasta 10MB)"}
            </span>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={getAssetUrl(receiptUrl)}
              alt="Comprobante"
              className="w-8 h-8 object-cover rounded border border-[var(--color-border)] shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs text-[var(--color-text-primary)] truncate font-medium block">
                {receiptFileName || "comprobante.jpg"}
              </span>
              <a
                href={getAssetUrl(receiptUrl)}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-600 hover:underline inline-block"
              >
                Ver en Neon S3
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveReceipt}
            className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
            title="Quitar comprobante"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
