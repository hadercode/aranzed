import { FolderTree, Scale, Filter, RotateCcw } from 'lucide-react';
import type { ProductTypeFilter, ProductStatusFilter } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import type { Category } from '@/features/catalog/categories/types';

export interface ProductFilterSelectsProps {
  typeFilter: ProductTypeFilter;
  setTypeFilter: (type: ProductTypeFilter) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  categories: Category[];
  uomFilter: string;
  setUomFilter: (uom: string) => void;
  uoms: UnitOfMeasure[];
  statusFilter: ProductStatusFilter;
  setStatusFilter: (status: ProductStatusFilter) => void;
  isFiltered: boolean;
  resetFilters: () => void;
}

export function ProductFilterSelects({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  uomFilter,
  setUomFilter,
  uoms,
  statusFilter,
  setStatusFilter,
  isFiltered,
  resetFilters,
}: ProductFilterSelectsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProductTypeFilter)}
          className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
        >
          <option value="all">Todos los tipos</option>
          <option value="TRADITIONAL">Tradicional</option>
          <option value="RAW_MATERIAL">Materia Prima</option>
          <option value="FINISHED_GOOD">Terminado</option>
          <option value="SERVICE">Servicio</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <FolderTree className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer max-w-[170px] truncate"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <Scale className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
        <select
          value={uomFilter}
          onChange={(e) => setUomFilter(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer max-w-[150px] truncate"
        >
          <option value="all">Todas las unidades</option>
          {uoms.map((uom) => (
            <option key={uom.id} value={uom.id}>
              {uom.name} ({uom.code})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:inline" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProductStatusFilter)}
          className="px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 transition-all cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Solo Activos</option>
          <option value="inactive">Solo Inactivos</option>
        </select>
      </div>

      {isFiltered && (
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface-bg)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-all cursor-pointer"
          title="Restablecer filtros"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpiar</span>
        </button>
      )}
    </div>
  );
}
