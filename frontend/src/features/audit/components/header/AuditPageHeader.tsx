import { Shield, RefreshCw, Download } from 'lucide-react';
import { PageHeader, Button } from '@/shared/components/ui';
import { useAuditContext } from '../../context';

export function AuditPageHeader() {
  const { loading, logs, fetchLogs, exportToJson } = useAuditContext();

  return (
    <PageHeader
      title="Trazas & Auditoría de Acciones"
      description="Supervisa en tiempo real las operaciones ejecutadas por usuarios, trazabilidad y estado antes/después de cada modificación."
      icon={<Shield className="w-6 h-6" />}
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fetchLogs()}
          disabled={loading}
          leftIcon={
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin text-[var(--color-sage-500)]' : ''}`}
            />
          }
          title="Refrescar lista"
        >
          Refrescar
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={exportToJson}
          disabled={logs.length === 0}
          leftIcon={<Download className="w-4 h-4" />}
          title="Exportar registros a JSON"
        >
          Exportar
        </Button>
      </div>
    </PageHeader>
  );
}

export default AuditPageHeader;
