import React from 'react';
import { ShoppingBag, Boxes, Layers, Wrench, CheckCircle2 } from 'lucide-react';
import { useProductFormContext } from '../../../context';
import type { ProductType } from '../../../types';

interface ProductTypeOption {
  type: ProductType;
  label: string;
  subtitle: string;
  desc: string;
  badge: string;
  icon: React.ReactNode;
}

const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  {
    type: 'TRADITIONAL',
    label: 'Producto Tradicional',
    subtitle: 'Comercio / Reventa',
    desc: 'Mercancía adquirida de proveedores para venta directa sin transformación física.',
    badge: 'Reventa estándar',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    type: 'RAW_MATERIAL',
    label: 'Materia Prima / Insumo',
    subtitle: 'Insumo de Producción',
    desc: 'Materiales base o componentes adquiridos para usarse en recetas o procesos de manufactura.',
    badge: 'Insumo base',
    icon: <Boxes className="w-5 h-5" />,
  },
  {
    type: 'FINISHED_GOOD',
    label: 'Producto Terminado',
    subtitle: 'Manufactura / Ensamblaje',
    desc: 'Bienes producidos, ensamblados o procesados internamente con materia prima.',
    badge: 'Producción interna',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    type: 'SERVICE',
    label: 'Servicio Profesional',
    subtitle: 'Intangible / Mano de Obra',
    desc: 'Horas técnicas, consultorías, mantenimiento y labores sin inventario físico.',
    badge: 'Sin stock físico',
    icon: <Wrench className="w-5 h-5" />,
  },
];

export interface ProductTypeSectionProps {
  selectedType?: ProductType;
  onSelectType?: (type: ProductType) => void;
  error?: string;
}

export function ProductTypeSection({
  selectedType: propSelectedType,
  onSelectType: propOnSelectType,
  error: propError,
}: ProductTypeSectionProps) {
  const context = useProductFormContext();

  const selectedType = propSelectedType ?? context.selectedType;
  const onSelectType =
    propOnSelectType ??
    ((type: ProductType) =>
      context.setValue('type', type, {
        shouldValidate: true,
        shouldDirty: true,
      }));
  const error = propError ?? context.errors.type?.message;

  return (
    <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <div>
          <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-sage-500)]" />
            1. Tipo de Ítem en el Catálogo
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Define el comportamiento operativo, contable e inventariable de este registro.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
          Requerido
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {PRODUCT_TYPE_OPTIONS.map((pt) => {
          const isSelected = selectedType === pt.type;

          return (
            <button
              key={pt.type}
              type="button"
              onClick={() => onSelectType(pt.type)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'border-[var(--color-sage-600)] bg-[var(--color-sage-50)]/70 dark:bg-[var(--color-sage-500)]/10 ring-2 ring-[var(--color-sage-500)]/30 shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-border-hover,var(--color-border))]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isSelected
                        ? 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-white dark:bg-neutral-800 shadow-2xs'
                        : 'text-[var(--color-text-muted)] bg-[var(--color-surface-card)] group-hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {pt.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[var(--color-sage-100)] dark:bg-[var(--color-sage-500)]/20 text-[var(--color-sage-800)] dark:text-[var(--color-sage-300)]'
                        : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                    }`}
                  >
                    {pt.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {pt.label}
                </h4>
                <p className="text-xs font-medium text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] mb-1.5">
                  {pt.subtitle}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                  {pt.desc}
                </p>
              </div>

              {isSelected && (
                <div className="mt-4 pt-2.5 border-t border-[var(--color-sage-200)] dark:border-[var(--color-sage-500)]/20 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-sage-700)] dark:text-[var(--color-sage-300)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Seleccionado</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
}

export default ProductTypeSection;
