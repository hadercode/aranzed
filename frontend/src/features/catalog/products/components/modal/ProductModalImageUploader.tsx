import React, { useRef, useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { TextInput } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../schemas/product.schema';
import { ProductModalImagePreviewBox } from './ProductModalImagePreviewBox';

export interface ProductModalImageUploaderProps {
  imageUrlValue?: string;
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  uploadProductImage: (file: File) => Promise<string>;
  isUploading: boolean;
  uploadError: string;
  clearUploadError: () => void;
}

export function ProductModalImageUploader({
  imageUrlValue,
  register,
  errors,
  setValue,
  uploadProductImage,
  isUploading,
  uploadError,
  clearUploadError,
}: ProductModalImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalUploadError, setModalUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModalUploadError(null);
    clearUploadError?.();

    if (!file.type.startsWith('image/')) {
      setModalUploadError('El archivo seleccionado debe ser una imagen (PNG, JPG, WEBP, GIF).');
      return;
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setModalUploadError(`La imagen supera el límite permitido de ${MAX_SIZE_MB}MB.`);
      return;
    }

    try {
      const storageUrl = await uploadProductImage(file);
      setValue('imageUrl', storageUrl, { shouldValidate: true, shouldDirty: true });
    } catch {
      // Handled in mutations
    }
  };

  const handleRemove = () => {
    setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true });
    setModalUploadError(null);
    clearUploadError?.();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Foto o Imagen del Producto
        </label>
        {imageUrlValue && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {imageUrlValue.includes('/storage/view') ? 'Neon S3' : 'Asignada'}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="p-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] space-y-3">
        <ProductModalImagePreviewBox
          imageUrlValue={imageUrlValue}
          isUploading={isUploading}
          onUploadClick={() => fileInputRef.current?.click()}
          onRemoveClick={handleRemove}
        />

        <div className="pt-2 border-t border-[var(--color-border)]">
          <TextInput
            sizeVariant="sm"
            {...register('imageUrl')}
            placeholder="O pega una URL: https://... o /storage/view?key=..."
            error={errors.imageUrl?.message}
          />
        </div>
      </div>

      {(uploadError || modalUploadError) && (
        <p className="text-xs text-rose-500 mt-1 font-medium">{modalUploadError || uploadError}</p>
      )}
    </div>
  );
}
