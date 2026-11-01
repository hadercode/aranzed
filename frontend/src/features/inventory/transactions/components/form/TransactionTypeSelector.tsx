import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  SlidersHorizontal,
} from 'lucide-react';
import type { InventoryTransactionType } from '../../types';

interface TransactionTypeSelectorProps {
  txType: InventoryTransactionType;
  setTxType: (type: InventoryTransactionType) => void;
  isEditMode: boolean;
}

export function TransactionTypeSelector({
  txType,
  setTxType,
  isEditMode,
}: TransactionTypeSelectorProps) {
  const movementTypes: Array<{
    type: InventoryTransactionType;
    label: string;
    description: string;
    icon: typeof ArrowDownCircle;
  }> = [
    {
      type: 'RECEPTION',
      label: 'Recepción (+)',
      description: 'Ingreso de mercancía por compras o saldos',
      icon: ArrowDownCircle,
    },
    {
      type: 'ISSUE',
      label: 'Salida (-)',
      description: 'Consumo interno, mermas o bajas',
      icon: ArrowUpCircle,
    },
    {
      type: 'TRANSFER',
      label: 'Transferencia',
      description: 'Reubicación entre almacenes',
      icon: ArrowLeftRight,
    },
    {
      type: 'ADJUSTMENT',
      label: 'Ajuste (+/-)',
      description: 'Auditoría y conciliación física',
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
        1. Tipo de Movimiento
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {movementTypes.map((m) => {
          const Icon = m.icon;
          const isSelected = txType === m.type;
          return (
            <button
              key={m.type}
              type="button"
              disabled={isEditMode}
              onClick={() => setTxType(m.type)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-[var(--color-sage-600)] bg-[var(--color-sage-50)] dark:bg-[var(--color-surface-hover)] shadow-xs ring-2 ring-[var(--color-sage-500)]/20'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-text-muted)]'
              } ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[var(--color-sage-600)] text-white'
                      : 'bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {m.label}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {m.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

