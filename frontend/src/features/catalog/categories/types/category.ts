export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  path: string | null;
  isActive: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  rootCategories: number;
  subcategories: number;
}

export type CategoryStatusFilter = 'all' | 'active' | 'inactive';

export interface CategoryFormData {
  id?: string;
  name: string;
  parentId: string;
  isActive: boolean;
}
