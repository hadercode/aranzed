import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCategoriesQuery } from './get-categories.query';

import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Category } from '@/catalog/categories/domain/entities/category.entity';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
