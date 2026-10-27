import { Layers, FileCheck2, Warehouse as WarehouseIcon, RotateCcw } from 'lucide-react';
import { SearchInput, Select, Button } from '@/shared/components/ui';
import type { Warehouse } from '../../warehouses/types';

export interface TransactionFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  warehouseFilter: string;
  onWarehouseFilterChange: (value: string) => void;
  warehouses: Warehouse[];
  onResetFilters?: () => void;
}

export function TransactionFilterBar({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  warehouses,
  onResetFilters,
}: TransactionFilterBarProps) {
  const hasActiveFilters = Boolean(
    searchTerm || typeFilter || statusFilter || warehouseFilter
  );

  return (
    <div className="bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] flex flex-wrap gap-3 items-center justify-between shadow-xs">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <SearchInput
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Buscar por Nº, referencia o motivo..."
          containerClassName="flex-1 min-w-[240px] max-w-md"
        />

        <Select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          leftIcon={<Layers className="w-4 h-4 text-[var(--color-text-muted)]" />}
          containerClassName="w-full sm:w-48 shrink-0"
          options={[
            { value: '', label: 'Todos los tipos' },
            { value: 'RECEPTION', label: 'Recepción (+)' },
            { value: 'ISSUE', label: 'Salida (-)' },
            { value: 'TRANSFER', label: 'Transferencia' },
            { value: 'ADJUSTMENT', label: 'Ajuste (+/-)' },
          ]}
          aria-label="Filtrar por tipo de movimiento"
        />

        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          leftIcon={<FileCheck2 className="w-4 h-4 text-[var(--color-text-muted)]" />}
          containerClassName="w-full sm:w-48 shrink-0"
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'COMPLETED', label: 'Completada' },
            { value: 'DRAFT', label: 'Borrador' },
            { value: 'IN_TRANSIT', label: 'En Tránsito' },
            { value: 'CANCELLED', label: 'Anulada' },
          ]}
          aria-label="Filtrar por estado"
        />

        <Select
          value={warehouseFilter}
          onChange={(e) => onWarehouseFilterChange(e.target.value)}
          leftIcon={<WarehouseIcon className="w-4 h-4 text-[var(--color-text-muted)]" />}
          containerClassName="w-full sm:w-56 shrink-0"
          options={[
            { value: '', label: 'Todos los almacenes' },
            ...warehouses.map((w) => ({
              value: w.id,
              label: `${w.code} - ${w.name}`,
            })),
          ]}
          aria-label="Filtrar por almacén"
        />

        {hasActiveFilters && onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}

export default TransactionFilterBar;

