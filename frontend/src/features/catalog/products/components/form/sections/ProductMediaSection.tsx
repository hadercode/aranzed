import React, { useRef, useState } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getAssetUrl } from '@/lib/api-client';
import { useProductFormContext } from '../../../context';

export function ProductMediaSection() {
  const {
    register,
    errors,
    setValue,
    imageUrlValue,
    productNameValue,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
  } = useProductFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const handleFileProcess = async (file: File) => {
    setLocalError(null);
    clearUploadError?.();

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setLocalError('El archivo seleccionado debe ser una imagen (PNG, JPG, WEBP, GIF).');
      return;
    }

    // Validar tamaño máximo (5MB)
    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`La imagen supera el límite permitido de ${MAX_SIZE_MB}MB.`);
      return;
    }

    try {
      const storageUrl = await uploadProductImage(file);
      setValue('imageUrl', storageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch {
      // Error manejado en useProductsMutations
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('imageUrl', '', {
      shouldValidate: true,
      shouldDirty: true,
    });
    setLocalError(null);
    clearUploadError?.();
  };

  const isStoredInS3 =
    imageUrlValue?.includes('/storage/view') || imageUrlValue?.startsWith('products/');

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[var(--color-sage-600)]" />
          5. Multimedia e Imagen
        </span>
        {imageUrlValue && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isStoredInS3 ? 'Almacenada en Neon S3' : 'Imagen Asignada'}
          </span>
        )}
      </div>

      {/* Error Feedback */}
      {(uploadError || localError) && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{localError || uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setLocalError(null);
              clearUploadError?.();
            }}
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
          >
            ×
          </button>
        </div>
      )}

      {/* Dropzone / Preview Area */}
      {imageUrlValue ? (
        <div className="relative aspect-4/3 rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface-bg)] flex items-center justify-center group shadow-2xs">
          <img
            src={getAssetUrl(imageUrlValue)}
            alt={productNameValue || 'Vista previa del producto'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Overlay Actions on Hover */}
          <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-white/90 text-neutral-800 hover:bg-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
              Cambiar Foto
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={handleRemoveImage}
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
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
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
      )}

      {/* Manual URL Input Option */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] font-semibold text-[var(--color-sage-600)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            {showManualUrl ? 'Ocultar enlace manual' : '¿Prefieres ingresar una URL externa?'}
          </button>
        </div>

        {showManualUrl && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200 space-y-1.5 mt-2">
            <input
              type="text"
              {...register('imageUrl')}
              placeholder="https://images.unsplash.com/photo-... o /storage/view?key=..."
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-mono border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                errors.imageUrl
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30'
              }`}
            />
            {errors.imageUrl ? (
              <p className="text-xs text-rose-500 font-medium">{errors.imageUrl.message}</p>
            ) : (
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Ingresa una URL directa HTTP/HTTPS o una ruta relativa de almacenamiento.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductMediaSection;
