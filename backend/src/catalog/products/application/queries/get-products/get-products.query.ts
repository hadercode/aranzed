import { ProductFilters } from '@/catalog/products/domain/repositories/product.repository.interface';

export class GetProductsQuery {
  constructor(public readonly filters?: ProductFilters) {}
}
