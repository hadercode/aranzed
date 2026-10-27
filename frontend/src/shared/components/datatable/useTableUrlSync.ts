import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface UseTableUrlSyncOptions<TFilters extends Record<string, any> = Record<string, any>> {
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSortBy?: string | null;
  defaultSortOrder?: 'asc' | 'desc' | null;
  defaultFilters?: TFilters;
}

export function useTableUrlSync<TFilters extends Record<string, any> = Record<string, any>>(
  options: UseTableUrlSyncOptions<TFilters> = {}
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    defaultPage = 1,
    defaultPageSize = 10,
    defaultSortBy = null,
    defaultSortOrder = null,
    defaultFilters = {} as TFilters,
  } = options;

  // 1. Lectura segura y reactiva desde los query params de la URL
  const page = useMemo(() => {
    const raw = searchParams.get('page');
    if (!raw) return defaultPage;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 1 ? defaultPage : parsed;
  }, [searchParams, defaultPage]);

  const pageSize = useMemo(() => {
    const raw = searchParams.get('pageSize') || searchParams.get('limit');
    if (!raw) return defaultPageSize;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 1 ? defaultPageSize : parsed;
  }, [searchParams, defaultPageSize]);

  const sortBy = useMemo(() => {
    return searchParams.get('sortBy') || defaultSortBy;
  }, [searchParams, defaultSortBy]);

  const sortOrder = useMemo<'asc' | 'desc' | null>(() => {
    const raw = searchParams.get('sortOrder');
    if (raw === 'asc' || raw === 'desc') return raw;
    return defaultSortOrder;
  }, [searchParams, defaultSortOrder]);

  const filters = useMemo(() => {
    const result: Record<string, any> = { ...defaultFilters };
    for (const key of Object.keys(defaultFilters)) {
      const val = searchParams.get(key);
      if (val !== null && val !== undefined) {
        result[key] = val;
      }
    }
    return result as TFilters;
  }, [searchParams, defaultFilters]);

  // 2. Función genérica para sincronizar parámetros con la URL
  const updateUrl = useCallback(
    (newParams: Record<string, string | number | null | undefined>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(newParams)) {
            if (value === null || value === undefined || value === '') {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateUrl({ page: newPage <= 1 ? null : newPage });
    },
    [updateUrl]
  );

  const setPageSize = useCallback(
    (newSize: number) => {
      updateUrl({
        pageSize: newSize === defaultPageSize ? null : newSize,
        page: null, // Al cambiar tamaño se reinicia a página 1
      });
    },
    [updateUrl, defaultPageSize]
  );

  const setSort = useCallback(
    (key: string | null, order: 'asc' | 'desc' | null) => {
      if (!key || !order) {
        updateUrl({ sortBy: null, sortOrder: null });
      } else {
        updateUrl({ sortBy: key, sortOrder: order });
      }
    },
    [updateUrl]
  );

  const setFilter = useCallback(
    (key: keyof TFilters | string, value: any) => {
      updateUrl({
        [key as string]: value,
        page: null, // Al cambiar un filtro se reinicia a página 1
      });
    },
    [updateUrl]
  );

  const resetAll = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    updateUrl,
    resetAll,
  };
}

export default useTableUrlSync;
