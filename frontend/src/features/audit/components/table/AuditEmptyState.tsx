import { RefreshCw, FileText } from 'lucide-react';

interface AuditEmptyStateProps {
  loading: boolean;
}

export function AuditEmptyState({ loading }: AuditEmptyStateProps) {
  if (loading) {
    return (
      <tr>
        <td colSpan={7} className="py-16 text-center text-gray-400">
          <div className="flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-sage-500)]" />
            <span>Cargando trazas de auditoría...</span>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={7} className="py-16 text-center text-gray-400">
        <div className="flex flex-col items-center justify-center gap-2">
          <FileText className="w-8 h-8 stroke-1 text-gray-300 dark:text-gray-600" />
          <p className="font-medium text-gray-600 dark:text-gray-400">
            No se encontraron registros
          </p>
          <p className="text-xs text-gray-400">
            Intenta cambiar los filtros o realizar nuevas acciones en la plataforma.
          </p>
        </div>
      </td>
    </tr>
  );
}

export default AuditEmptyState;
