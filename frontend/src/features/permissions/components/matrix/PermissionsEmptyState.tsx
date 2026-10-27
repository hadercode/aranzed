import { ShieldAlert, SearchX } from "lucide-react";

interface PermissionsEmptyStateProps {
  type: "no-role" | "no-results";
  onClearSearch?: () => void;
}

export function PermissionsEmptyState({
  type,
  onClearSearch,
}: PermissionsEmptyStateProps) {
  if (type === "no-role") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-sage-50)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/15 dark:text-[var(--color-sage-400)] flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          Ningún rol seleccionado
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-sm">
          Selecciona un rol de la barra lateral izquierda para ver y gestionar su matriz de permisos asociados.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-bg)] text-[var(--color-text-muted)] flex items-center justify-center mb-4 border border-[var(--color-border)]">
        <SearchX size={32} />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
        No se encontraron permisos
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-sm">
        No hay permisos ni módulos que coincidan con los criterios de búsqueda actuales.
      </p>
      {onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-surface-bg)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors cursor-pointer"
        >
          Limpiar filtro de búsqueda
        </button>
      )}
    </div>
  );
}

export default PermissionsEmptyState;
