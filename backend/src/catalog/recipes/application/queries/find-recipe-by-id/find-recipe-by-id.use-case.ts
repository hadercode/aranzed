import { Injectable, Inject } from '@nestjs/common';
import { Recipe } from '@/catalog/recipes/domain/entities/recipe.entity';
import type { IRecipeRepository } from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import { EntityNotFoundException } from '@/core/domain/domain-exception';

@Injectable()
export class FindRecipeByIdUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundException('Receta', id);
    }
    return recipe;
  }
}
