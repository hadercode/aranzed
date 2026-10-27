import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuditContext } from '../../context';

interface AuditTablePaginationProps {
  logsLength?: number;
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalItems?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export function AuditTablePagination({
  logsLength: propLogsLength,
  currentPage: propCurrentPage,
  itemsPerPage: propItemsPerPage,
  totalPages: propTotalPages,
  totalItems: propTotalItems,
  loading: propLoading,
  onPageChange: propOnPageChange,
  onItemsPerPageChange: propOnItemsPerPageChange,
}: AuditTablePaginationProps) {
  const context = useAuditContext();

  const logsLength = propLogsLength ?? context.logs.length;
  const currentPage = propCurrentPage ?? context.currentPage;
  const itemsPerPage = propItemsPerPage ?? context.itemsPerPage;
  const totalPages = propTotalPages ?? context.totalPages;
  const totalItems = propTotalItems ?? context.totalItems;
  const loading = propLoading ?? context.loading;
  const onPageChange = propOnPageChange ?? context.handlePageChange;
  const onItemsPerPageChange = propOnItemsPerPageChange ?? context.handleItemsPerPageChange;

  return (
    <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-bg)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-3">
        <span>
          Mostrando{' '}
          <strong className="text-[var(--color-text-primary)]">
            {logsLength > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          </strong>{' '}
          a{' '}
          <strong className="text-[var(--color-text-primary)]">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </strong>{' '}
          de <strong className="text-[var(--color-text-primary)]">{totalItems}</strong> registros
        </span>

        <div className="flex items-center gap-1">
          <span>Por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] text-xs focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1 || loading}
          className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-medium text-[var(--color-text-primary)]">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || loading}
          className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AuditTablePagination;
