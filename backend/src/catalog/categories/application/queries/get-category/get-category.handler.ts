import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { EntityNotFoundException } from '@/core/domain/domain-exception';

import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Category } from '@/catalog/categories/domain/entities/category.entity';
import { GetCategoryQuery } from './get-category.query';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(query: GetCategoryQuery): Promise<Category> {
    const category = await this.categoryRepository.findById(query.id);
    if (!category) {
      throw new EntityNotFoundException('Categoría', query.id);
    }
    return category;
  }
}
