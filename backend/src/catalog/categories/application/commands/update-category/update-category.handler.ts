import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateCategoryCommand } from './update-category.command';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Category } from '@/catalog/categories/domain/entities/category.entity';
import {
  BusinessRuleException,
  EntityNotFoundException,
} from '@/core/domain/domain-exception';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const { id, data } = command;
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new EntityNotFoundException('Categoría', id);
    }

    const oldPath = category.path;
    let pathChanged = false;

    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new BusinessRuleException(
          `Ya existe una categoría con el nombre "${data.name}"`,
        );
      }
      category.name = data.name;
      pathChanged = true;
    }

    if (data.parentId !== undefined && data.parentId !== category.parentId) {
      if (data.parentId === id) {
        throw new BusinessRuleException(
          'Una categoría no puede ser su propio padre',
        );
      }
      category.parentId = data.parentId;
      pathChanged = true;
    }

    if (data.isActive !== undefined) {
      category.isActive = data.isActive;
    }

    category.validate();

    if (pathChanged) {
      let parentPath = '';
      if (category.parentId) {
        const parent = await this.categoryRepository.findById(
          category.parentId,
        );
        if (!parent) {
          throw new EntityNotFoundException(
            'Categoría padre',
            category.parentId,
          );
        }
        parentPath = parent.path;
      }
      category.updatePath(parentPath);
    }

    const savedCategory = await this.categoryRepository.save(category);

    if (pathChanged && oldPath) {
      const descendants = await this.categoryRepository.findByPathPrefix(
        oldPath + '/',
      );
      for (const descendant of descendants) {
        const relativePath = descendant.path.substring(oldPath.length);
        descendant.path = savedCategory.path + relativePath;
        await this.categoryRepository.save(descendant);
      }
    }

    return savedCategory;
  }
}
