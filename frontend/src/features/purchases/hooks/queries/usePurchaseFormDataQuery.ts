import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { purchasesService } from '../../services';
import type { Purchase } from '../../types';
import type { Product } from '@/features/catalog/products/types';

export interface UsePurchaseFormDataQueryResult {
  purchase: Purchase | null;
  rawMaterials: Product[];
  allProducts: Product[];
  loadingInitial: boolean;
  loadError: string;
  refetchInitial: () => Promise<void>;
}

export function usePurchaseFormDataQuery(purchaseId?: string): UsePurchaseFormDataQueryResult {
  // 1. Catálogo de productos/materias primas con caché compartida
  const productsQuery = useQuery<Product[]>({
    queryKey: ['catalog', 'products'],
    queryFn: () => ApiClient.get<Product[]>('/catalog/products').catch(() => []),
    staleTime: 1000 * 60 * 5,
  });

  // 2. Registro de compra para modo edición
  const purchaseQuery = useQuery<Purchase | null>({
    queryKey: ['purchases', purchaseId],
    queryFn: () => (purchaseId ? purchasesService.getById(purchaseId) : Promise.resolve(null)),
    enabled: Boolean(purchaseId),
    staleTime: 1000 * 60 * 2,
  });

  const allProducts = productsQuery.data || [];
  const rawMaterials = allProducts.filter((p) => p.type === 'RAW_MATERIAL' && p.isActive);

  const loadingInitial =
    productsQuery.isLoading || (Boolean(purchaseId) && purchaseQuery.isLoading);

  const activeError = productsQuery.error || purchaseQuery.error;
  const loadError = activeError
    ? activeError instanceof Error
      ? activeError.message
      : String(activeError)
    : '';

  const refetchInitial = async () => {
    await Promise.all([
      productsQuery.refetch(),
      purchaseId ? purchaseQuery.refetch() : Promise.resolve(),
    ]);
  };

  return {
    purchase: purchaseQuery.data || null,
    rawMaterials: rawMaterials.length > 0 ? rawMaterials : allProducts,
    allProducts,
    loadingInitial,
    loadError,
    refetchInitial,
  };
}
