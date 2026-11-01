import React, { useRef, useState } from "react";
import {
  Save,
  ShoppingBag,
  Boxes,
  Layers,
  Wrench,
  Image as ImageIcon,
  Calculator,
  UploadCloud,
  Trash2,
  Loader2,
  ShieldCheck,
  Store,
  Factory,
} from "lucide-react";
import { Button, Modal } from "@/shared/components/ui";
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
} from "@/shared/components/ui/form";
import { getAssetUrl } from "@/lib/api-client";
import { useProductsStore } from "../../store";
import {
  useProductsQuery,
  useProductsMutations,
  useProductsModals,
  useProductForm,
} from "../../hooks";
import type { ProductType } from "../../types";

export function ProductFormModal() {
  const {
    isFormModalOpen,
    editingProduct,
    closeFormModal,
    showSuccess,
  } = useProductsStore();

  const { uoms, categories, refetch } = useProductsQuery();

  const {
    createProduct,
    updateProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useProductsMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  const { handleSaveProduct } = useProductsModals({
    createProduct,
    updateProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    clearMutationError,
    onSuccess: showSuccess,
  });

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
    handleTypeSelect,
  } = useProductForm({
    editingProduct,
    uoms,
    onSubmit: handleSaveProduct,
  });

  const selectedType = watch("type");
  const imageUrlValue = watch("imageUrl");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalUploadError, setModalUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModalUploadError(null);
    clearUploadError?.();

    if (!file.type.startsWith("image/")) {
      setModalUploadError(
        "El archivo debe ser una imagen válida (PNG, JPG, WEBP, GIF).",
      );
      return;
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setModalUploadError(
        `La imagen supera el límite permitido de ${MAX_SIZE_MB}MB.`,
      );
      return;
    }

    try {
      const storageUrl = await uploadProductImage(file);
      setValue("imageUrl", storageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch {
      // Error manejado en useProductsMutations
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const productTypes: {
    type: ProductType;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "TRADITIONAL",
      label: "Tradicional",
      desc: "Mercancía de reventa estándar",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      type: "RAW_MATERIAL",
      label: "Materia Prima",
      desc: "Insumo de producción",
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      type: "FINISHED_GOOD",
      label: "Terminado",
      desc: "Bienes manufacturados",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      type: "SERVICE",
      label: "Servicio",
      desc: "Intangible y consultoría",
      icon: <Wrench className="w-4 h-4" />,
    },
  ];

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={closeFormModal}
      title={
        editingProduct
          ? "Editar Producto o Servicio"
          : "Nuevo Producto o Servicio"
      }
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-h-[80vh] overflow-y-auto pr-1"
      >
        {mutationError && (
          <div className="p-3.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {mutationError}
          </div>
        )}

        {/* Product Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
            Tipo de Producto <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {productTypes.map((pt) => {
              const isSelected = selectedType === pt.type;
              return (
                <button
                  key={pt.type}
                  type="button"
                  onClick={() => handleTypeSelect(pt.type)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-[var(--color-sage-600)] bg-[var(--color-sage-50)]/70 dark:bg-[var(--color-sage-500)]/10 ring-2 ring-[var(--color-sage-500)]/20"
                      : "border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-border-hover,var(--color-border))]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? "text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-white dark:bg-neutral-800 shadow-2xs"
                          : "text-[var(--color-text-muted)] bg-[var(--color-surface-card)]"
                      }`}
                    >
                      {pt.icon}
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      {pt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] line-clamp-1">
                    {pt.desc}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* General Info using global TextInput & Select */}
        <div className="space-y-3.5">
          <TextInput
            label="Nombre Comercial"
            required
            {...register("name")}
            placeholder="Ej. Laptop ThinkPad T14, Mesa Roble Ensamblada, Consultoría TI..."
            maxLength={150}
            error={errors.name?.message}
          />

          <Select
            label="Unidad de Medida"
            required
            {...register("uomId")}
            error={errors.uomId?.message}
          >
            <option value="">Seleccione una unidad...</option>
            {uoms.map((uom) => (
              <option key={uom.id} value={uom.id}>
                {uom.code} — {uom.name}
              </option>
            ))}
          </Select>

          <Select label="Categoría" {...register("categoryId")}>
            <option value="">Sin categoría asignada</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Image Upload & Live Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Foto o Imagen del Producto
            </label>
            {imageUrlValue && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {imageUrlValue.includes("/storage/view")
                  ? "Neon S3"
                  : "Asignada"}
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
            <div className="flex items-center gap-3">
              {/* Preview Box */}
              <div className="relative w-14 h-14 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--color-sage-600)]" />
                ) : imageUrlValue ? (
                  <img
                    src={getAssetUrl(imageUrlValue)}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
                )}
              </div>

              {/* Upload Buttons */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    loading={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<UploadCloud className="w-4 h-4" />}
                  >
                    {imageUrlValue ? "Cambiar Foto" : "Subir Foto"}
                  </Button>

                  {imageUrlValue && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => {
                        setValue("imageUrl", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setModalUploadError(null);
                        clearUploadError?.();
                      }}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Quitar
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  JPG, PNG o WEBP (máx. 5MB) en la carpeta{" "}
                  <strong>products</strong> de Neon S3.
                </p>
              </div>
            </div>

            {/* Manual URL Input using TextInput */}
            <div className="pt-2 border-t border-[var(--color-border)]">
              <TextInput
                sizeVariant="sm"
                {...register("imageUrl")}
                placeholder="O pega una URL: https://... o /storage/view?key=..."
                error={errors.imageUrl?.message}
              />
            </div>
          </div>

          {(uploadError || modalUploadError) && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {modalUploadError || uploadError}
            </p>
          )}
        </div>

        {/* Description using global Textarea */}
        <Textarea
          label="Descripción Detallada"
          rows={2}
          {...register("description")}
          placeholder="Especificaciones técnicas, notas de fabricación o detalles del servicio..."
          error={errors.description?.message}
        />

        {/* Financial / Cost & Margin Section using TextInput */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[var(--color-sage-600)]" />
              Estructura Financiera y Precios
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Cálculo reactivo con Zod Schema
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextInput
              label="Último Costo ($)"
              type="number"
              step="0.01"
              min="0"
              sizeVariant="sm"
              error={errors.lastCost?.message}
              {...register("lastCost", { valueAsNumber: true })}
              onChange={(e) =>
                handleCostChange(parseFloat(e.target.value) || 0)
              }
            />

            <TextInput
              label="Margen Ganancia (%)"
              type="number"
              step="0.1"
              min="0"
              sizeVariant="sm"
              error={errors.profitMargin?.message}
              {...register("profitMargin", { valueAsNumber: true })}
              onChange={(e) =>
                handleMarginChange(parseFloat(e.target.value) || 0)
              }
            />

            <TextInput
              label="Precio de Venta ($)"
              type="number"
              step="0.01"
              min="0"
              sizeVariant="sm"
              error={errors.lastSalePrice?.message}
              {...register("lastSalePrice", { valueAsNumber: true })}
              onChange={(e) =>
                handleSalePriceChange(parseFloat(e.target.value) || 0)
              }
            />
          </div>
        </div>

        {/* Status, Purpose & Availability Toggles using global Checkbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Checkbox
            card
            label={
              <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Producto Activo
              </span>
            }
            description="Habilitado en el catálogo general."
            {...register("isActive")}
          />

          <Checkbox
            card
            label={
              <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
                <Store className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Disponible para Venta
              </span>
            }
            description="Visible en POS y ventas comerciales."
            {...register("isForSale")}
          />

          <Checkbox
            card
            label={
              <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
                <Factory className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Uso Interno / Insumo
              </span>
            }
            description="Disponible para recetas y manufactura."
            {...register("isForInternalUse")}
          />

          <Checkbox
            card
            label={
              <span className="flex items-center gap-1 font-bold text-[var(--color-text-primary)]">
                <Boxes className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Controla Inventario
              </span>
            }
            description="Valuación FIFO y stock en almacén."
            {...register("manageInventory")}
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="secondary"
            onClick={closeFormModal}
            disabled={isMutating}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            loading={isMutating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {editingProduct ? "Guardar Cambios" : "Crear Producto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductFormModal;
