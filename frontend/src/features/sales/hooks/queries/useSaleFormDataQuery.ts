import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { salesService } from '../../services';
import type { Sale } from '../../types';
import type { Product } from '@/features/catalog/products/types';

export interface UseSaleFormDataQueryResult {
  sale: Sale | null;
  sellableProducts: Product[];
  allProducts: Product[];
  loadingInitial: boolean;
  loadError: string;
  refetchInitial: () => Promise<void>;
}

export function useSaleFormDataQuery(saleId?: string): UseSaleFormDataQueryResult {
  // 1. Catálogo de productos
  const productsQuery = useQuery<Product[]>({
    queryKey: ['catalog', 'products'],
    queryFn: async () => {
      const res = await ApiClient.get<Product[]>('/catalog/products');
      return Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60,
  });

  // 2. Documento de venta para modo edición
  const saleQuery = useQuery<Sale | null>({
    queryKey: ['sales', saleId],
    queryFn: () => (saleId ? salesService.getById(saleId) : Promise.resolve(null)),
    enabled: Boolean(saleId),
    staleTime: 1000 * 60 * 2,
  });

  const allProducts = Array.isArray(productsQuery.data) ? productsQuery.data : [];
  // Priorizar productos comercializables activos (TRADITIONAL, FINISHED_GOOD, SERVICE)
  const sellableProducts = allProducts.filter(
    (p) =>
      p.isActive !== false &&
      (p.type === 'TRADITIONAL' ||
        p.type === 'FINISHED_GOOD' ||
        p.type === 'SERVICE'),
  );

  const loadingInitial =
    productsQuery.isLoading || (Boolean(saleId) && saleQuery.isLoading);

  const activeError = productsQuery.error || saleQuery.error;
  const loadError = activeError
    ? activeError instanceof Error
      ? activeError.message
      : String(activeError)
    : '';

  const refetchInitial = async () => {
    await Promise.all([
      productsQuery.refetch(),
      saleId ? saleQuery.refetch() : Promise.resolve(),
    ]);
  };

  return {
    sale: saleQuery.data || null,
    sellableProducts: sellableProducts.length > 0 ? sellableProducts : allProducts,
    allProducts,
    loadingInitial,
    loadError,
    refetchInitial,
  };
}
