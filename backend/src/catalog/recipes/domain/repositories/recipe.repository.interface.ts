import { Recipe } from '../entities/recipe.entity';
import { RecipeStatus } from '../enums/recipe-status.enum';

export const RECIPE_REPOSITORY_TOKEN = 'IRecipeRepository';

export interface FindRecipesFilters {
  search?: string;
  productId?: string;
  status?: RecipeStatus;
  limit?: number;
  offset?: number;
}

export interface IRecipeRepository {
  findAll(
    filters?: FindRecipesFilters,
  ): Promise<{ recipes: Recipe[]; total: number }>;
  findById(id: string): Promise<Recipe | null>;
  findByCode(code: string): Promise<Recipe | null>;
  findByProductId(productId: string): Promise<Recipe[]>;
  save(recipe: Recipe): Promise<Recipe>;
  delete(id: string): Promise<void>;
  getNextSequenceCode(): Promise<string>;
}
