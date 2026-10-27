import { Building2, Save, RotateCcw } from 'lucide-react';
import { PageHeader, Button } from '@/shared/components/ui';
import { useCompanyContext } from '../../context';

export function CompanyPageHeader() {
  const { isSaving, hasChanges, handleResetChanges, handleSubmit } = useCompanyContext();

  return (
    <PageHeader
      title="Datos de la Empresa"
      description="Configuración institucional, identidad de marca, moneda y ajustes generales"
      icon={<Building2 className="w-6 h-6" />}
    >
      <div className="flex items-center gap-2.5">
        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetChanges}
            disabled={isSaving}
            leftIcon={<RotateCcw size={15} />}
          >
            Descartar
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          onClick={() => handleSubmit()}
          loading={isSaving}
          loadingText="Guardando..."
          disabled={!hasChanges}
          leftIcon={<Save size={18} />}
        >
          Guardar Cambios
        </Button>
      </div>
    </PageHeader>
  );
}

export default CompanyPageHeader;
