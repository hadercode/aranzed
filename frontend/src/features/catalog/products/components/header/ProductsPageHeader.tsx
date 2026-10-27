import { useNavigate } from 'react-router-dom';
import { Package, Plus, RefreshCw } from 'lucide-react';
import { Button, PageHeader } from '@/shared/components/ui';
import { useProductsContext } from '../../context';

export interface ProductsPageHeaderProps {
  onNewProduct?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function ProductsPageHeader({
  onNewProduct: propOnNewProduct,
  onRefresh: propOnRefresh,
  loading: propLoading,
}: ProductsPageHeaderProps) {
  const navigate = useNavigate();
  const context = useProductsContext();
  const onNewProduct = propOnNewProduct ?? (() => navigate('/catalog/products/new'));
  const onRefresh = propOnRefresh ?? context.refetch;
  const loading = propLoading ?? context.loading;

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
