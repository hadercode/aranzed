import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductsQuery } from './get-products.query';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import { Product } from '@/catalog/products/domain/entities/product.entity';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<Product[]> {
    return this.productRepository.findAll(query.filters);
  }
}
