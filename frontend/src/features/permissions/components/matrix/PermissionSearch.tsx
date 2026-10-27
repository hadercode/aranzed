import { Search, X, CheckSquare, Square } from "lucide-react";
import { usePermissionsContext } from "../../context";

export function PermissionSearch() {
  const {
    searchQuery,
    setSearchQuery,
    stats,
    handleSelectAll,
    handleDeselectAll,
  } = usePermissionsContext();

  return (
    <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface-card)]">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          size={17}
        />
        <input
          type="text"
          placeholder="Buscar permiso o módulo (ej: roles, create)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2 bg-[var(--color-surface-bg)] border border-[var(--color-border)] rounded-xl outline-none focus:border-[var(--color-sage-500)] focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all text-xs md:text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer p-0.5 rounded-full hover:bg-[var(--color-border)]"
            aria-label="Limpiar búsqueda"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Bulk actions and counters */}
      <div className="flex items-center gap-2 justify-between sm:justify-end text-xs">
        {searchQuery ? (
          <span className="text-[var(--color-text-secondary)] font-medium mr-2">
            Mostrando {stats.filteredCount} de {stats.totalPermissions}
          </span>
        ) : null}

        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer font-medium"
        >
          <CheckSquare size={14} className="text-[var(--color-sage-500)]" />
          <span>Todos</span>
        </button>

        <button
          type="button"
          onClick={handleDeselectAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer font-medium"
        >
          <Square size={14} className="text-gray-400" />
          <span>Ninguno</span>
        </button>
      </div>
    </div>
  );
}

export default PermissionSearch;
