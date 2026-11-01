import { Package } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { TextInput, Textarea } from "@/shared/components/ui/form";
import type { ProductFormData } from "../../../schemas/product.schema";

export interface ProductBasicInfoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  productNameValue?: string;
}

export function ProductBasicInfoSection({
  register,
  errors,
  productNameValue = "",
}: ProductBasicInfoSectionProps) {
  const nameCharCount = productNameValue.length;

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--color-sage-600)]" />
          2. Información General del Artículo
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {nameCharCount}/150 caracteres
        </span>
      </div>

      <div className="space-y-4">
        {/* Name input using global TextInput */}
        <TextInput
          label="Nombre del Producto / Servicio"
          required
          {...register("name")}
          placeholder="Ej. Laptop ThinkPad T14 Gen 3, Escritorio Modular Roble, Mantenimiento TI..."
          maxLength={150}
          error={errors.name?.message}
          helperText={
            !errors.name
              ? "Nombre descriptivo y claro para cotizaciones, compras e inventario (máx. 150 caracteres)."
              : undefined
          }
        />

        {/* Description textarea using global Textarea */}
        <Textarea
          label="Descripción Detallada (Opcional)"
          rows={3}
          {...register("description")}
          placeholder="Detalles técnicos, especificaciones de garantía, instrucciones de uso o alcance del servicio..."
          maxLength={1000}
          error={errors.description?.message}
          helperText="Detalles adicionales para presupuestos y fichas técnicas."
        />
      </div>
    </div>
  );
}

export default ProductBasicInfoSection;
