import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoriesTablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  filteredCount: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (val: number) => void;
}

export function CategoriesTablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  filteredCount,
  onPageChange,
  onItemsPerPageChange,
}: CategoriesTablePaginationProps) {
  if (filteredCount <= 10) return null;

  return (
    <div className="px-6 py-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-2">
        <span>Filas por página:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)]"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>
          Página {currentPage} de {totalPages} ({filteredCount} categorías)
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

