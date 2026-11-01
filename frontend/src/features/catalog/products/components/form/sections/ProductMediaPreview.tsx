import { RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { getAssetUrl } from '@/lib/api-client';

export interface ProductMediaPreviewProps {
  imageUrlValue: string;
  productNameValue?: string;
  isUploading: boolean;
  onUploadClick: () => void;
  onRemoveImage: () => void;
}

export function ProductMediaPreview({
  imageUrlValue,
  productNameValue,
  isUploading,
  onUploadClick,
  onRemoveImage,
}: ProductMediaPreviewProps) {
  return (
    <div className="relative aspect-4/3 rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-bg)] flex items-center justify-center group shadow-2xs">
      <img
        src={getAssetUrl(imageUrlValue)}
        alt={productNameValue || 'Vista previa del producto'}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
        <button
          type="button"
          disabled={isUploading}
          onClick={onUploadClick}
          className="px-3 py-2 rounded-xl bg-white/90 text-neutral-800 hover:bg-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
          Cambiar Foto
        </button>
        <button
          type="button"
          disabled={isUploading}
          onClick={onRemoveImage}
          className="px-3 py-2 rounded-xl bg-rose-600/90 text-white hover:bg-rose-600 text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>

      {isUploading && (
        <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-sage-400)]" />
          <span className="text-xs font-medium">Subiendo foto a Neon S3...</span>
        </div>
      )}
    </div>
  );
}

