import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { TextInput } from '@/shared/components/ui/form';
import type { ProductFormData } from '../../../schemas/product.schema';

export interface ProductManualUrlInputProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export function ProductManualUrlInput({ register, errors }: ProductManualUrlInputProps) {
  const [showManualUrl, setShowManualUrl] = useState(false);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setShowManualUrl(!showManualUrl)}
        className="text-[11px] font-semibold text-[var(--color-sage-600)] hover:underline flex items-center gap-1 cursor-pointer mb-1.5"
      >
        <LinkIcon className="w-3 h-3" />
        {showManualUrl ? 'Ocultar enlace manual' : '¿Prefieres ingresar una URL externa?'}
      </button>

      {showManualUrl && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200 mt-2">
          <TextInput
            sizeVariant="sm"
            {...register('imageUrl')}
            placeholder="https://images.unsplash.com/photo-... o /storage/view?key=..."
            error={errors.imageUrl?.message}
            helperText={
              !errors.imageUrl
                ? 'Ingresa una URL directa HTTP/HTTPS o una ruta relativa de almacenamiento.'
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}

