import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { UnitOfMeasure } from '../../types';

export function useUnitsOfMeasureQuery() {
  const [data, setData] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const uoms = await ApiClient.get<UnitOfMeasure[]>('/catalog/uofm');
      setData(uoms || []);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Error al cargar las unidades de medida';
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
        const uoms = await ApiClient.get<UnitOfMeasure[]>('/catalog/uofm');
        if (isMounted) {
          setData(uoms || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === 'string'
              ? err
              : 'Error al cargar las unidades de medida';
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

  return { data, loading, error, refetch, setData };
}
