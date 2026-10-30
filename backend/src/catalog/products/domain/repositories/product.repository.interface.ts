import { Product } from '../entities/product.entity';
import { ProductType } from '../enums/product-type.enum';

export const PRODUCT_REPOSITORY_TOKEN = 'IProductRepository';

export interface ProductFilters {
  type?: ProductType;
  categoryId?: string;
  uomId?: string;
  isActive?: boolean;
  search?: string;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(filters?: ProductFilters): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  saveMany(products: Product[]): Promise<Product[]>;
  delete(id: string): Promise<void>;
}
