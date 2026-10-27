import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { transactionsService } from '../../services';
import type { InventoryTransaction } from '../../types';

export function useTransactionFormDataQuery(id?: string) {
  const isEditMode = Boolean(id);

  // 1. Cargar productos del catálogo
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery<any[]>({
    queryKey: ['catalog', 'products'],
    queryFn: async () => {
      const res = await ApiClient.get<any[]>('/catalog/products');
      return Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2. Transacción existente si estamos en modo edición
  const {
    data: initialTransaction,
    isLoading: isLoadingInitial,
    error: loadError,
  } = useQuery<InventoryTransaction>({
    queryKey: ['inventory', 'transaction', id],
    queryFn: () => transactionsService.getById(id!),
    enabled: isEditMode,
  });

  const resolvedError = loadError || productsError;

  return {
    products,
    initialTransaction,
    isLoadingInitial: isLoadingInitial || isLoadingProducts,
    loadError: resolvedError ? String(resolvedError) : null,
  };
}

export default useTransactionFormDataQuery;
