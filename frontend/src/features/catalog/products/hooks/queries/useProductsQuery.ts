import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Product } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import type { Category } from '@/features/catalog/categories/types';

export function useProductsQuery() {
  const [data, setData] = useState<Product[]>([]);
  const [uoms, setUoms] = useState<UnitOfMeasure[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [productsRes, uomsRes, categoriesRes] = await Promise.all([
        ApiClient.get<Product[]>('/catalog/products'),
        ApiClient.get<UnitOfMeasure[]>('/catalog/uofm').catch(() => []),
        ApiClient.get<Category[]>('/catalog/categories').catch(() => []),
      ]);
      setData(productsRes || []);
      setUoms(uomsRes || []);
      setCategories(categoriesRes || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al cargar los productos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [productsRes, uomsRes, categoriesRes] = await Promise.all([
          ApiClient.get<Product[]>('/catalog/products'),
          ApiClient.get<UnitOfMeasure[]>('/catalog/uofm').catch(() => []),
          ApiClient.get<Category[]>('/catalog/categories').catch(() => []),
        ]);
        if (isMounted) {
          setData(productsRes || []);
          setUoms(uomsRes || []);
          setCategories(categoriesRes || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
              ? err
              : 'Error al cargar los productos';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, uoms, categories, loading, error, refetch, setData };
}
