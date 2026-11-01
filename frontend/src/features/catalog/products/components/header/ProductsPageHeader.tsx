import { useNavigate } from 'react-router-dom';
import { Package, Plus, RefreshCw, UploadCloud } from 'lucide-react';
import { Button, PageHeader } from '@/shared/components/ui';
import { useProductsStore } from '../../store';
import { useProductsQuery } from '../../hooks';

export interface ProductsPageHeaderProps {
  onNewProduct?: () => void;
  onRefresh?: () => void;
  onBulkImport?: () => void;
  loading?: boolean;
}

export function ProductsPageHeader({
  onNewProduct: propOnNewProduct,
  onRefresh: propOnRefresh,
  onBulkImport: propOnBulkImport,
  loading: propLoading,
}: ProductsPageHeaderProps) {
  const navigate = useNavigate();
  const openBulkImportModal = useProductsStore((state) => state.openBulkImportModal);
  const { loading: queryLoading, refetch } = useProductsQuery();

  const onNewProduct = propOnNewProduct ?? (() => navigate('/catalog/products/new'));
  const onRefresh = propOnRefresh ?? refetch;
  const onBulkImport = propOnBulkImport ?? openBulkImportModal;
  const loading = propLoading ?? queryLoading;

  return (
    <PageHeader
      title="Catálogo de Productos y Servicios"
      description="Gestiona tus productos comerciales, manufacturados y servicios, asociando unidades de medida, costos y márgenes de ganancia."
      icon={<Package className="w-6 h-6" />}
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
        variant="secondary"
        onClick={onBulkImport}
        leftIcon={<UploadCloud className="w-4 h-4" />}
      >
        Carga Masiva
      </Button>

      <Button
        type="button"
        variant="primary"
        onClick={onNewProduct}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nuevo Producto
      </Button>
    </PageHeader>
  );
}

export default ProductsPageHeader;
