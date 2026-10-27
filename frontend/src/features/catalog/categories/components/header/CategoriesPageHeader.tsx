import { FolderTree, Plus, RefreshCw } from 'lucide-react';
import { Button, PageHeader } from '@/shared/components/ui';
import { useCategoriesContext } from '../../context';

export interface CategoriesPageHeaderProps {
  onNewCategory?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function CategoriesPageHeader({
  onNewCategory: propOnNewCategory,
  onRefresh: propOnRefresh,
  loading: propLoading,
}: CategoriesPageHeaderProps) {
  const context = useCategoriesContext();
  const onNewCategory = propOnNewCategory ?? context.handleOpenCreate;
  const onRefresh = propOnRefresh ?? context.refetch;
  const loading = propLoading ?? context.loading;

  return (
    <PageHeader
      title="Categorías del Catálogo"
      description="Organiza tu catálogo de productos en estructuras jerárquicas multinivel y gestiona su disponibilidad."
      icon={<FolderTree className="w-6 h-6" />}
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
        onClick={onNewCategory}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nueva Categoría
      </Button>
    </PageHeader>
  );
}

export default CategoriesPageHeader;
