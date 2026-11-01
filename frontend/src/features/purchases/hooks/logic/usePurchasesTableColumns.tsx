import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DataTableColumn } from '@/shared/components/ui';
import { useCurrencyStore } from '@/shared/hooks/store';
import { usePurchasesStore } from '../../store';
import type { Purchase } from '../../types';
import { buildPurchasesTableColumns } from './purchasesTableColumnsBuilder';

export interface UsePurchasesTableColumnsOptions {
  openCompleteModal?: (purchase: Purchase) => void;
  openDeleteModal?: (purchase: Purchase) => void;
}

export function usePurchasesTableColumns(options?: UsePurchasesTableColumnsOptions) {
  const navigate = useNavigate();
  const storeOpenComplete = usePurchasesStore((s) => s.openCompleteModal);
  const storeOpenDelete = usePurchasesStore((s) => s.openDeleteModal);

  const openCompleteModal = options?.openCompleteModal ?? storeOpenComplete;
  const openDeleteModal = options?.openDeleteModal ?? storeOpenDelete;

  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol } = useCurrencyStore();

  const columns: DataTableColumn<Purchase>[] = useMemo(
    () =>
      buildPurchasesTableColumns({
        functionalCurrency,
        functionalSymbol,
        localCurrency,
        localSymbol,
        onView: (p) => navigate(`/purchases/${p.id}`),
        onComplete: openCompleteModal,
        onDelete: openDeleteModal,
      }),
    [
      functionalCurrency,
      functionalSymbol,
      localCurrency,
      localSymbol,
      navigate,
      openCompleteModal,
      openDeleteModal,
    ]
  );

  return columns;
}

export default usePurchasesTableColumns;
