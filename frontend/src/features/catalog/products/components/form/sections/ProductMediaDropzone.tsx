import React from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

export interface ProductMediaDropzoneProps {
  isUploading: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

export function ProductMediaDropzone({
  isUploading,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: ProductMediaDropzoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`relative aspect-4/3 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
        isDragging
          ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-500)]/10 scale-[1.01]'
          : 'border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-sage-500)]/60 hover:bg-[var(--color-surface-hover)]'
      }`}
    >
      {isUploading ? (
        <div className="flex flex-col items-center justify-center gap-2.5">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-sage-600)]" />
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">
            Subiendo a Neon S3...
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            Optimizando y almacenando en la nube
          </span>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center mb-3 text-[var(--color-sage-600)] shadow-2xs group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[var(--color-text-primary)] block">
            Subir fotografía del producto
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] mt-1 max-w-[220px]">
            Arrastra y suelta tu archivo aquí, o haz clic para explorar en tu equipo
          </span>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] mt-2 px-2 py-0.5 rounded-md bg-[var(--color-surface-card)] border border-[var(--color-border)]">
            PNG, JPG o WEBP (Máx. 5MB)
          </span>
        </>
      )}
    </div>
  );
}

