import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Product } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import type { Category } from '@/features/catalog/categories/types';

export interface UseProductFormDataQueryResult {
  product: Product | null;
  uoms: UnitOfMeasure[];
  categories: Category[];
  loadingInitial: boolean;
  loadError: string;
  refetchInitial: () => Promise<void>;
}

export function useProductFormDataQuery(productId?: string): UseProductFormDataQueryResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [uoms, setUoms] = useState<UnitOfMeasure[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setLoadingInitial(true);
      setLoadError('');
    }

    try {
      const promises: [
        Promise<UnitOfMeasure[]>,
        Promise<Category[]>,
        Promise<Product | null>,
      ] = [
        ApiClient.get<UnitOfMeasure[]>('/catalog/uofm').catch(() => []),
        ApiClient.get<Category[]>('/catalog/categories').catch(() => []),
        productId
          ? ApiClient.get<Product>(`/catalog/products/${productId}`)
          : Promise.resolve(null),
      ];

      const [uomsRes, categoriesRes, productRes] = await Promise.all(promises);

      setUoms(uomsRes || []);
      setCategories(categoriesRes || []);
      setProduct(productRes);
      setLoadError('');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Error al cargar los datos del producto';
      setLoadError(msg);
    } finally {
      setLoadingInitial(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    product,
    uoms,
    categories,
    loadingInitial,
    loadError,
    refetchInitial: () => loadData(true),
  };
}
