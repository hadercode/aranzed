import { Scale, Plus, RefreshCw } from 'lucide-react';
import { Button, PageHeader } from '@/shared/components/ui';
import { useUnitsOfMeasureContext } from '../../context';

export interface UnitsOfMeasurePageHeaderProps {
  onNewUom?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function UnitsOfMeasurePageHeader({
  onNewUom: propOnNewUom,
  onRefresh: propOnRefresh,
  loading: propLoading,
}: UnitsOfMeasurePageHeaderProps) {
  const context = useUnitsOfMeasureContext();
  const onNewUom = propOnNewUom ?? context.handleOpenCreate;
  const onRefresh = propOnRefresh ?? context.refetch;
  const loading = propLoading ?? context.loading;

  return (
    <PageHeader
      title="Unidades de Medida"
      description="Define las magnitudes y unidades de cómputo para la comercialización, compras y control de inventario de tus productos."
      icon={<Scale className="w-6 h-6" />}
    >
      <Button
        type="button"
        variant="secondary"
        onClick={() => void onRefresh()}
        loading={loading}
        leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
      >
        Actualizar
      </Button>

      <Button
        type="button"
        variant="primary"
        onClick={onNewUom}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nueva Unidad
      </Button>
    </PageHeader>
  );
}

export default UnitsOfMeasurePageHeader;
