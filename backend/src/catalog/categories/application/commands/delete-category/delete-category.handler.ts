import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteCategoryCommand } from './delete-category.command';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { EntityNotFoundException } from '@/core/domain/domain-exception';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const category = await this.categoryRepository.findById(command.id);
    if (!category) {
      throw new EntityNotFoundException('Categoría', command.id);
    }
    await this.categoryRepository.delete(command.id);
  }
}
