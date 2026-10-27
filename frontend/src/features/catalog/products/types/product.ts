export type ProductType = 'TRADITIONAL' | 'RAW_MATERIAL' | 'FINISHED_GOOD' | 'SERVICE';

export interface ProductUom {
  id: string;
  code: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  type: ProductType;
  uomId: string;
  categoryId?: string | null;
  profitMargin: number;
  lastCost: number;
  lastSalePrice: number;
  isActive: boolean;
  manageInventory?: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  uom?: ProductUom | null;
  category?: ProductCategory | null;
}

export interface CreateProductDto {
  name: string;
  type: ProductType;
  uomId: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  profitMargin?: number;
  lastCost?: number;
  lastSalePrice?: number;
  isActive?: boolean;
  manageInventory?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  type?: ProductType;
  uomId?: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string | null;
  profitMargin?: number;
  lastCost?: number;
  lastSalePrice?: number;
  isActive?: boolean;
  manageInventory?: boolean;
}

export interface ProductStats {
  total: number;
  traditional: number;
  rawMaterial: number;
  finishedGood: number;
  service: number;
  active: number;
  inactive: number;
}

export type ProductTypeFilter = 'all' | ProductType;
export type ProductStatusFilter = 'all' | 'active' | 'inactive';

export type { ProductFormData } from '../schemas/product.schema';

