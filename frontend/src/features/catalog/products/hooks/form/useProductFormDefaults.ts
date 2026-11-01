import type { Product, ProductType } from '../../types';
import type { UnitOfMeasure } from '@/features/catalog/units-of-measure/types';
import type { ProductFormData } from '../../schemas/product.schema';

export function getDefaultFlagsForType(type: ProductType) {
  switch (type) {
    case 'RAW_MATERIAL':
      return {
        isForSale: false,
        isForInternalUse: true,
        manageInventory: true,
      };
    case 'SERVICE':
      return {
        isForSale: true,
        isForInternalUse: true,
        manageInventory: false,
      };
    case 'FINISHED_GOOD':
      return {
        isForSale: true,
        isForInternalUse: false,
        manageInventory: true,
      };
    case 'TRADITIONAL':
    default:
      return {
        isForSale: true,
        isForInternalUse: false,
        manageInventory: true,
      };
  }
}

export function buildInitialProductFormData(
  editingProduct: Product | null,
  uoms: UnitOfMeasure[]
): ProductFormData {
  if (editingProduct) {
    const typeDefaults = getDefaultFlagsForType(editingProduct.type);
    return {
      name: editingProduct.name,
      description: editingProduct.description || '',
      imageUrl: editingProduct.imageUrl || '',
      type: editingProduct.type,
      uomId: editingProduct.uomId,
      categoryId: editingProduct.categoryId || '',
      profitMargin: Number(editingProduct.profitMargin) || 0,
      lastCost: Number(editingProduct.lastCost) || 0,
      lastSalePrice: Number(editingProduct.lastSalePrice) || 0,
      isActive: editingProduct.isActive !== undefined ? editingProduct.isActive : true,
      isForSale:
        editingProduct.isForSale !== undefined
          ? editingProduct.isForSale
          : typeDefaults.isForSale,
      isForInternalUse:
        editingProduct.isForInternalUse !== undefined
          ? editingProduct.isForInternalUse
          : typeDefaults.isForInternalUse,
      manageInventory:
        editingProduct.manageInventory !== undefined
          ? editingProduct.manageInventory
          : typeDefaults.manageInventory,
    };
  }

  const defaults = getDefaultFlagsForType('TRADITIONAL');
  return {
    name: '',
    description: '',
    imageUrl: '',
    type: 'TRADITIONAL',
    uomId: uoms.length > 0 ? uoms[0].id : '',
    categoryId: '',
    profitMargin: 30,
    lastCost: 0,
    lastSalePrice: 0,
    isActive: true,
    isForSale: defaults.isForSale,
    isForInternalUse: defaults.isForInternalUse,
    manageInventory: defaults.manageInventory,
  };
}

export function buildProductSavePayload(formData: ProductFormData) {
  return {
    name: formData.name.trim(),
    description: formData.description?.trim() || undefined,
    imageUrl: formData.imageUrl?.trim() || undefined,
    type: formData.type,
    uomId: formData.uomId,
    categoryId: formData.categoryId || undefined,
    profitMargin: Number(formData.profitMargin) || 0,
    lastCost: Number(formData.lastCost) || 0,
    lastSalePrice: Number(formData.lastSalePrice) || 0,
    isActive: formData.isActive,
    isForSale: formData.isForSale,
    isForInternalUse: formData.isForInternalUse,
    manageInventory: formData.manageInventory,
  };
}
