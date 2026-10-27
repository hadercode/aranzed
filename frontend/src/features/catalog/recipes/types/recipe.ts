import type { ProductType } from '@/features/catalog/products/types';

export type RecipeStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export interface RecipeProductSummary {
  id: string;
  name: string;
  type: ProductType;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
  lastSalePrice: number;
}

export interface RecipeItemProductSummary {
  id: string;
  name: string;
  type: ProductType;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
}

export interface RecipeItem {
  id?: string;
  recipeId?: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotalCost: number;
  notes?: string | null;
  sortOrder: number;
  product?: RecipeItemProductSummary | null;
}

export interface Recipe {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  productId: string;
  status: RecipeStatus;
  yieldQuantity: number;
  totalCost: number;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  items: RecipeItem[];
  product?: RecipeProductSummary | null;
}

export interface RecipeFilters {
  search?: string;
  productId?: string;
  status?: RecipeStatus | 'ALL';
}

export interface RecipeStats {
  total: number;
  active: number;
  draft: number;
  inactive: number;
  avgCost: number;
}
