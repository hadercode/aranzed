import { useProductsQuery } from '../queries/useProductsQuery';
import { useProductsMutations } from '../mutations/useProductsMutations';
import { useProductsStats } from './useProductsStats';
import { useProductsFilters } from './useProductsFilters';
import { useProductsDialogs } from '../modals/useProductsDialogs';
import { useProductsModals } from '../modals/useProductsModals';

export function useProductsPage() {
  // 1. Data queries
  const {
    data: products,
    uoms,
    categories,
    loading,
    error: fetchError,
    refetch,
  } = useProductsQuery();

  // 2. Mutations
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    isMutating,
    error: mutationError,
    clearError: clearMutationError,
  } = useProductsMutations({
    onSuccess: () => {
      void refetch();
    },
  });

  // 3. Derived KPI Stats
  const { stats } = useProductsStats({ products });

  // 4. Filtering, Sorting & Pagination
  const filterState = useProductsFilters({ products });

  // 5. Delete Confirmation & Feedback Dialogs
  const dialogState = useProductsDialogs({
    deleteProduct,
  });

  // 6. Form Modals & Actions
  const modalState = useProductsModals({
    createProduct,
    updateProduct,
    uploadProductImage,
    isUploading,
    uploadError,
    clearUploadError,
    clearMutationError,
    onSuccess: dialogState.showSuccess,
  });

  return {
    products,
    uoms,
    categories,
    loading,
    fetchError,
    mutationError,
    isMutating,
    clearMutationError,
    refetch,

    // KPI Metrics
    stats,

    // Filter, Sorting & Pagination State
    ...filterState,

    // Form Modals & Bulk Import
    ...modalState,

    // Delete Confirmation & Feedback Dialogs
    ...dialogState,
  };
}

export type UseProductsPageReturn = ReturnType<typeof useProductsPage>;

