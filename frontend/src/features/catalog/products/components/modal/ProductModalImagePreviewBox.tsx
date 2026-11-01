import { UploadCloud, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getAssetUrl } from '@/lib/api-client';

export interface ProductModalImagePreviewBoxProps {
  imageUrlValue?: string;
  isUploading: boolean;
  onUploadClick: () => void;
  onRemoveClick: () => void;
}

export function ProductModalImagePreviewBox({
  imageUrlValue,
  isUploading,
  onUploadClick,
  onRemoveClick,
}: ProductModalImagePreviewBoxProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-sage-600)]" />
        ) : imageUrlValue ? (
          <img
            src={getAssetUrl(imageUrlValue)}
            alt="Vista previa"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <ImageIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            loading={isUploading}
            onClick={onUploadClick}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            {imageUrlValue ? 'Cambiar Foto' : 'Subir Foto'}
          </Button>

          {imageUrlValue && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isUploading}
              onClick={onRemoveClick}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Quitar
            </Button>
          )}
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
          JPG, PNG o WEBP (máx. 5MB) en Neon S3.
        </p>
      </div>
    </div>
  );
}

