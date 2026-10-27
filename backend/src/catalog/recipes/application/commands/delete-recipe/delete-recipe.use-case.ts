import { Injectable, Inject } from '@nestjs/common';
import type { IRecipeRepository } from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import { EntityNotFoundException } from '@/core/domain/domain-exception';

@Injectable()
export class DeleteRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.recipeRepository.findById(id);
    if (!existing) {
      throw new EntityNotFoundException('Receta', id);
    }
    await this.recipeRepository.delete(id);
  }
}
