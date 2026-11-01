import React, { useRef, useState } from 'react';
import { Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { ProductFormData } from '../../../schemas/product.schema';
import { ProductMediaPreview } from './ProductMediaPreview';
import { ProductMediaDropzone } from './ProductMediaDropzone';
import { ProductManualUrlInput } from './ProductManualUrlInput';

export interface ProductMediaSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  imageUrlValue?: string;
  productNameValue?: string;
  uploadProductImage: (file: File) => Promise<string>;
  isUploading: boolean;
  uploadError: string;
  clearUploadError: () => void;
}

export function ProductMediaSection({
  register,
  errors,
  setValue,
  imageUrlValue,
  productNameValue,
  uploadProductImage,
  isUploading,
  uploadError,
  clearUploadError,
}: ProductMediaSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    setLocalError(null);
    clearUploadError?.();

    if (!file.type.startsWith('image/')) {
      setLocalError('El archivo seleccionado debe ser una imagen (PNG, JPG, WEBP, GIF).');
      return;
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLocalError(`La imagen supera el límite permitido de ${MAX_SIZE_MB}MB.`);
      return;
    }

    try {
      const storageUrl = await uploadProductImage(file);
      setValue('imageUrl', storageUrl, { shouldValidate: true, shouldDirty: true });
    } catch {
      // Error manejado en useProductsMutations
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true });
    setLocalError(null);
    clearUploadError?.();
  };

  const isStoredInS3 =
    imageUrlValue?.includes('/storage/view') || imageUrlValue?.startsWith('products/');

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
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

      {(uploadError || localError) && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{localError || uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => { setLocalError(null); clearUploadError?.(); }}
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
          >
            ×
          </button>
        </div>
      )}

      {imageUrlValue ? (
        <ProductMediaPreview
          imageUrlValue={imageUrlValue}
          productNameValue={productNameValue}
          isUploading={isUploading}
          onUploadClick={() => fileInputRef.current?.click()}
          onRemoveImage={handleRemoveImage}
        />
      ) : (
        <ProductMediaDropzone
          isUploading={isUploading}
          isDragging={isDragging}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileProcess(f); }}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        />
      )}

      <ProductManualUrlInput register={register} errors={errors} />
    </div>
  );
}

export default ProductMediaSection;
