import type { AuditLog } from '../../types/audit';
import { useAuditContext } from '../../context';
import { AuditTableRow } from './AuditTableRow';
import { AuditEmptyState } from './AuditEmptyState';
import { AuditTablePagination } from './AuditTablePagination';

export interface AuditLogsTableProps {
  logs?: AuditLog[];
  loading?: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  onSelectLog?: (log: AuditLog) => void;
}

export function AuditLogsTable({
  logs: propLogs,
  loading: propLoading,
  currentPage: propCurrentPage,
  itemsPerPage: propItemsPerPage,
  totalPages: propTotalPages,
  totalItems: propTotalItems,
  onPageChange: propOnPageChange,
  onItemsPerPageChange: propOnItemsPerPageChange,
  onSelectLog: propOnSelectLog,
}: AuditLogsTableProps) {
  const context = useAuditContext();

  const logs = propLogs ?? context.logs;
  const loading = propLoading ?? context.loading;
  const currentPage = propCurrentPage ?? context.currentPage;
  const itemsPerPage = propItemsPerPage ?? context.itemsPerPage;
  const totalPages = propTotalPages ?? context.totalPages;
  const totalItems = propTotalItems ?? context.totalItems;
  const onPageChange = propOnPageChange ?? context.handlePageChange;
  const onItemsPerPageChange = propOnItemsPerPageChange ?? context.handleItemsPerPageChange;
  const onSelectLog = propOnSelectLog ?? context.openLogDetail;

  return (
    <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[11px] font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase">
              <th className="py-3.5 px-4">Fecha y Hora</th>
              <th className="py-3.5 px-4">Usuario</th>
              <th className="py-3.5 px-4">Acción</th>
              <th className="py-3.5 px-4">Módulo / Objeto</th>
              <th className="py-3.5 px-4">Petición HTTP</th>
              <th className="py-3.5 px-4">IP / Resultado</th>
              <th className="py-3.5 px-4 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-sm text-[var(--color-text-primary)]">
            {logs.length === 0 ? (
              <AuditEmptyState loading={loading} />
            ) : (
              logs.map((log) => (
                <AuditTableRow key={log.id} log={log} onSelectLog={onSelectLog} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <AuditTablePagination
        logsLength={logs.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        totalItems={totalItems}
        loading={loading}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}

export default AuditLogsTable;
