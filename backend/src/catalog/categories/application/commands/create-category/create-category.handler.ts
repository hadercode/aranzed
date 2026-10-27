import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateCategoryCommand } from './create-category.command';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Category } from '@/catalog/categories/domain/entities/category.entity';
import {
  BusinessRuleException,
  EntityNotFoundException,
} from '@/core/domain/domain-exception';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const existing = await this.categoryRepository.findByName(command.name);
    if (existing) {
      throw new BusinessRuleException(
        `Ya existe una categoría con el nombre "${command.name}"`,
      );
    }

    let parentPath = '';
    if (command.parentId) {
      const parent = await this.categoryRepository.findById(command.parentId);
      if (!parent) {
        throw new EntityNotFoundException('Categoría padre', command.parentId);
      }
      parentPath = parent.path;
    }

    const category = new Category({
      id: randomUUID(),
      name: command.name,
      parentId: command.parentId,
      isActive: command.isActive ?? true,
      createdById: command.createdById,
    });

    category.updatePath(parentPath);
    category.validate();

    return this.categoryRepository.save(category);
  }
}
