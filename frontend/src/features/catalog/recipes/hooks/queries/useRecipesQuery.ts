import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Recipe } from '../../types';

interface RecipesApiResponse {
  recipes: Recipe[];
  total: number;
}

export function useRecipesQuery() {
  const [data, setData] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ApiClient.get<RecipesApiResponse | Recipe[]>('/catalog/recipes');
      const list = Array.isArray(res) ? res : res?.recipes || [];
      setData(list);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al cargar las recetas';
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
        const res = await ApiClient.get<RecipesApiResponse | Recipe[]>('/catalog/recipes');
        if (isMounted) {
          const list = Array.isArray(res) ? res : res?.recipes || [];
          setData(list);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
              ? err
              : 'Error al cargar las recetas';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
