import { AlertCircle, RefreshCw } from 'lucide-react';
import { useProductsContext } from '../../context';
import { Button } from '@/shared/components/ui';

export function ProductsErrorBanner() {
  const { fetchError, refetch, loading } = useProductsContext();

  if (!fetchError) return null;

  return (
    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        <p className="text-sm font-medium">{fetchError}</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => void refetch()}
        loading={loading}
        leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
      >
        Reintentar
      </Button>
    </div>
  );
}

export default ProductsErrorBanner;
