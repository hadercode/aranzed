import { Upload, X, FileText } from "lucide-react";

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
      <label className="text-xs font-medium text-[var(--color-text-secondary)]">
        Comprobante / Capture (Opcional)
      </label>
      {!receiptUrl ? (
        <div className="border border-dashed border-[var(--color-border)] hover:border-sage-500/50 rounded-xl p-3 text-center transition-colors">
          <input
            id={fileInputId}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
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
                ? "Subiendo comprobante..."
                : "Adjuntar capture o PDF bancario (Hasta 10MB)"}
            </span>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2 min-w-0">
            {receiptUrl.toLowerCase().endsWith(".pdf") ? (
              <FileText className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <img
                src={receiptUrl}
                alt="Comprobante"
                className="w-8 h-8 object-cover rounded border border-[var(--color-border)] shrink-0"
              />
            )}
            <span className="text-xs text-[var(--color-text-primary)] truncate font-medium">
              {receiptFileName || "comprobante.jpg"}
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveReceipt}
            className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

