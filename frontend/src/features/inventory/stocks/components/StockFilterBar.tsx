import { Search } from 'lucide-react';
import type { Warehouse } from '../../warehouses/types';

interface StockFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedWarehouseId: string;
  onWarehouseChange: (value: string) => void;
  excludeDepleted: boolean;
  onExcludeDepletedChange: (checked: boolean) => void;
  warehouses: Warehouse[];
}

export function StockFilterBar({
  searchTerm,
  onSearchChange,
  selectedWarehouseId,
  onWarehouseChange,
  excludeDepleted,
  onExcludeDepletedChange,
  warehouses,
}: StockFilterBarProps) {
  return (
    <div className="bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-wrap gap-4 items-center justify-between shadow-xs">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por SKU o Producto..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>

        <select
          value={selectedWarehouseId}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
        >
          <option value="">Todos los almacenes</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.code} - {w.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--color-text-secondary)] select-none">
          <input
            type="checkbox"
            checked={excludeDepleted}
            onChange={(e) => onExcludeDepletedChange(e.target.checked)}
            className="rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)]"
          />
          Ocultar existencias agotadas (0)
        </label>
      </div>
    </div>
  );
}
