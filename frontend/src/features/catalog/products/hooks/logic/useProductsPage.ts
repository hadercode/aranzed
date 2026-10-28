import { useState, useMemo, useCallback } from 'react';
import { useProductsQuery } from '../queries/useProductsQuery';
import { useProductsMutations } from '../mutations/useProductsMutations';
import type {
  Product,
  ProductStats,
  ProductTypeFilter,
  ProductStatusFilter,
  ProductType,
} from '../../types';

export function useProductsPage() {
  const {
    data: products,
    uoms,
    categories,
    loading,
    error: fetchError,
    refetch,
  } = useProductsQuery();

  // Dialog and Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Selected item targets
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProductTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uomFilter, setUomFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Derived KPI Stats
  const stats = useMemo<ProductStats>(() => {
    let traditional = 0;
    let rawMaterial = 0;
    let finishedGood = 0;
    let service = 0;
    let active = 0;
    let inactive = 0;

    for (const prod of products) {
      if (prod.isActive) {
        active++;
      } else {
        inactive++;
      }

      if (prod.type === 'TRADITIONAL') traditional++;
      else if (prod.type === 'RAW_MATERIAL') rawMaterial++;
      else if (prod.type === 'FINISHED_GOOD') finishedGood++;
      else if (prod.type === 'SERVICE') service++;
    }

    return {
      total: products.length,
      traditional,
      rawMaterial,
      finishedGood,
      service,
      active,
      inactive,
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = (prod.description || '').toLowerCase().includes(query);
        const matchesUom = (prod.uom?.code || '').toLowerCase().includes(query);
        const matchesCat = (prod.category?.name || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesUom && !matchesCat) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && prod.type !== typeFilter) return false;

      // Status filter
      if (statusFilter === 'active' && !prod.isActive) return false;
      if (statusFilter === 'inactive' && prod.isActive) return false;

      // Category filter
      if (categoryFilter !== 'all' && prod.categoryId !== categoryFilter) return false;

      // UoM filter
      if (uomFilter !== 'all' && prod.uomId !== uomFilter) return false;

      return true;
    });
  }, [products, searchTerm, typeFilter, statusFilter, categoryFilter, uomFilter]);

  // Paginated Products
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setUomFilter('all');
    setCurrentPage(1);
  }, []);

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    clearMutationError();
    setIsFormModalOpen(true);
  }, [clearMutationError]);

  const openEditModal = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      clearMutationError();
      setIsFormModalOpen(true);
    },
    [clearMutationError]
  );

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingProduct(null);
  }, []);

  const handleSaveProduct = useCallback(
    async (data: {
      name: string;
      type: ProductType;
      uomId: string;
      description?: string;
      imageUrl?: string;
      categoryId?: string;
      profitMargin: number;
      lastCost: number;
      lastSalePrice: number;
      isActive: boolean;
    }) => {
      try {
        const payload = {
          name: data.name.trim(),
          description: data.description?.trim() || undefined,
          imageUrl: data.imageUrl?.trim() || undefined,
          type: data.type,
          uomId: data.uomId,
          categoryId: data.categoryId || undefined,
          profitMargin: Number(data.profitMargin) || 0,
          lastCost: Number(data.lastCost) || 0,
          lastSalePrice: Number(data.lastSalePrice) || 0,
          isActive: data.isActive,
        };

        if (editingProduct) {
          await updateProduct(editingProduct.id, payload);
          setSuccessMessage(`El producto "${data.name}" ha sido actualizado correctamente.`);
        } else {
          await createProduct(payload);
          setSuccessMessage(`El producto "${data.name}" ha sido creado con éxito.`);
        }

        setIsFormModalOpen(false);
        setIsSuccessOpen(true);
      } catch {
        // Error handled by mutation hook
      }
    },
    [editingProduct, createProduct, updateProduct]
  );

  // Delete handlers
  const openDeleteConfirm = useCallback((product: Product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  }, []);

  const handleDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setIsDeleteConfirmOpen(false);
      setSuccessMessage(`El producto "${productToDelete.name}" fue eliminado.`);
      setIsSuccessOpen(true);
      setProductToDelete(null);
    } catch {
      // Error handled by mutation hook
    }
  }, [productToDelete, deleteProduct]);

  const closeSuccessDialog = useCallback(() => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  }, []);

  return {
    products,
    uoms,
    categories,
    loading,
    fetchError,
    mutationError,
    clearMutationError,
    refetch,

    // Stats & Filters
    stats,
    filteredProducts,
    paginatedProducts,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    uomFilter,
    setUomFilter,
    resetFilters,

    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,

    // Modals and dialogs
    isFormModalOpen,
    openCreateModal,
    openEditModal,
    closeFormModal,
    editingProduct,

    // Form & Upload
    handleSaveProduct,
    uploadProductImage,
    isMutating,
    isUploading,
    uploadError,
    clearUploadError,

    // Delete
    isDeleteConfirmOpen,
    productToDelete,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDeleteProduct,

    // Feedback
    isSuccessOpen,
    successMessage,
    closeSuccessDialog,
  };
}
