import React from 'react';
import { ShoppingBag, Boxes, Layers, Wrench } from 'lucide-react';
import type { ProductType } from '../../types';

export interface ProductModalTypeSelectorProps {
  selectedType: ProductType;
  onSelectType: (type: ProductType) => void;
  error?: string;
}

export function ProductModalTypeSelector({
  selectedType,
  onSelectType,
  error,
}: ProductModalTypeSelectorProps) {
  const productTypes: {
    type: ProductType;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'TRADITIONAL',
      label: 'Tradicional',
      desc: 'Compra y venta directa',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      type: 'RAW_MATERIAL',
      label: 'Materia Prima',
      desc: 'Insumo para recetas',
      icon: <Boxes className="w-4 h-4" />,
    },
    {
      type: 'FINISHED_GOOD',
      label: 'Terminado',
      desc: 'Bienes manufacturados',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      type: 'SERVICE',
      label: 'Servicio',
      desc: 'Intangible y consultoría',
      icon: <Wrench className="w-4 h-4" />,
    },
  ];

  return (
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
              onClick={() => onSelectType(pt.type)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-[var(--color-sage-600)] bg-[var(--color-sage-50)]/70 dark:bg-[var(--color-sage-500)]/10 ring-2 ring-[var(--color-sage-500)]/20'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-border-hover,var(--color-border))]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)] bg-white dark:bg-neutral-800 shadow-2xs'
                      : 'text-[var(--color-text-muted)] bg-[var(--color-surface-card)]'
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
      {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

