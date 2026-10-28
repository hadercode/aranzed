import React, { useRef, useState } from "react";
import {
  Save,
  ShoppingBag,
  Layers,
  Wrench,
  Image as ImageIcon,
  Calculator,
  UploadCloud,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button, Modal } from "@/shared/components/ui";
import { getAssetUrl } from "@/lib/api-client";
import { useProductsContext } from "../../context";
import { useProductForm } from "../../hooks";
import type { ProductType } from "../../types";

export function ProductFormModal() {
  const {
    isFormModalOpen,
    editingProduct,
    isMutating,
    mutationError,
    uoms,
    categories,
    closeFormModal,
    handleSaveProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
  } = useProductsContext();

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    handleCostChange,
    handleMarginChange,
    handleSalePriceChange,
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
      type: "FINISHED_GOOD",
      label: "Producto Terminado",
      desc: "Bienes fabricados o ensamblados",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      type: "SERVICE",
      label: "Servicio",
      desc: "Mano de obra y consultoría intangible",
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {productTypes.map((pt) => {
              const isSelected = selectedType === pt.type;
              return (
                <button
                  key={pt.type}
                  type="button"
                  onClick={() =>
                    setValue("type", pt.type, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
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

        {/* Name, UoM and Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              Nombre del Producto o Servicio{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Ej. Laptop ThinkPad T14, Mesa Roble Ensamblada, Consultoría TI..."
              maxLength={150}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              Unidad de Medida <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("uomId")}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.uomId
                  ? "border-rose-500 focus:ring-rose-500/30"
                  : "border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30"
              }`}
            >
              <option value="">Seleccione una unidad...</option>
              {uoms.map((uom) => (
                <option key={uom.id} value={uom.id}>
                  {uom.code} — {uom.name}
                </option>
              ))}
            </select>
            {errors.uomId && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                {errors.uomId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              Categoría
            </label>
            <select
              {...register("categoryId")}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
            >
              <option value="">Sin categoría asignada</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
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

            {/* Manual URL Input */}
            <div className="pt-2 border-t border-[var(--color-border)]">
              <input
                type="text"
                {...register("imageUrl")}
                placeholder="O pega una URL: https://... o /storage/view?key=..."
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border bg-[var(--color-surface-card)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                  errors.imageUrl
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30"
                }`}
              />
            </div>
          </div>

          {(uploadError || modalUploadError) && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {modalUploadError || uploadError}
            </p>
          )}
          {errors.imageUrl && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
            Descripción Detallada
          </label>
          <textarea
            rows={2}
            {...register("description")}
            placeholder="Especificaciones técnicas, notas de fabricación o detalles del servicio..."
            className="w-full px-3.5 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all resize-none"
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Financial / Cost & Margin Section */}
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
            {/* Last Cost */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Último Costo ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("lastCost", { valueAsNumber: true })}
                onChange={(e) =>
                  handleCostChange(parseFloat(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 rounded-xl text-sm font-mono border bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 transition-all ${
                  errors.lastCost
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30"
                }`}
              />
              {errors.lastCost && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {errors.lastCost.message}
                </p>
              )}
            </div>

            {/* Profit Margin */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Margen Ganancia (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register("profitMargin", { valueAsNumber: true })}
                onChange={(e) =>
                  handleMarginChange(parseFloat(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 rounded-xl text-sm font-mono border bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 transition-all ${
                  errors.profitMargin
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-[var(--color-border)] focus:ring-[var(--color-sage-500)]/30"
                }`}
              />
              {errors.profitMargin && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {errors.profitMargin.message}
                </p>
              )}
            </div>

            {/* Last Sale Price */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                Precio de Venta ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("lastSalePrice", { valueAsNumber: true })}
                onChange={(e) =>
                  handleSalePriceChange(parseFloat(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 rounded-xl text-sm font-mono font-bold border bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 transition-all ${
                  errors.lastSalePrice
                    ? "border-rose-500 focus:ring-rose-500/30"
                    : "border-[var(--color-sage-400)]/60 focus:ring-[var(--color-sage-500)]/30"
                }`}
              />
              {errors.lastSalePrice && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {errors.lastSalePrice.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)]">
          <input
            type="checkbox"
            id="productIsActive"
            {...register("isActive")}
            className="w-4 h-4 rounded text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)] cursor-pointer"
          />
          <label
            htmlFor="productIsActive"
            className="text-xs text-[var(--color-text-secondary)] cursor-pointer"
          >
            <strong className="text-[var(--color-text-primary)]">
              Producto Activo
            </strong>{" "}
            — Disponible para emisión en pedidos, compras y ventas.
          </label>
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
