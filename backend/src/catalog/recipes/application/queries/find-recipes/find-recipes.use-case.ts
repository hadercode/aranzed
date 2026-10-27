import { Injectable, Inject } from '@nestjs/common';
import { Recipe } from '@/catalog/recipes/domain/entities/recipe.entity';
import type {
  IRecipeRepository,
  FindRecipesFilters,
} from '@/catalog/recipes/domain/repositories/recipe.repository.interface';

@Injectable()
export class FindRecipesUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(
    filters?: FindRecipesFilters,
  ): Promise<{ recipes: Recipe[]; total: number }> {
    return this.recipeRepository.findAll(filters);
  }
}
