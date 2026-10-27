import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import { CreateRecipeItemCommandDto } from '../create-recipe/create-recipe.command';

export class UpdateRecipeCommand {
  constructor(
    public readonly id: string,
    public readonly code?: string,
    public readonly name?: string,
    public readonly productId?: string,
    public readonly status?: RecipeStatus,
    public readonly yieldQuantity?: number,
    public readonly description?: string,
    public readonly items?: CreateRecipeItemCommandDto[],
    public readonly syncProductCost?: boolean,
  ) {}
}
