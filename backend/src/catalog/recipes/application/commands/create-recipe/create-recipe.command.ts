import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';

export interface CreateRecipeItemCommandDto {
  productId: string;
  quantity: number;
  unitCost: number;
  notes?: string;
  sortOrder?: number;
}

export class CreateRecipeCommand {
  constructor(
    public readonly code: string | undefined,
    public readonly name: string,
    public readonly productId: string,
    public readonly status: RecipeStatus | undefined,
    public readonly yieldQuantity: number | undefined,
    public readonly description: string | undefined,
    public readonly items: CreateRecipeItemCommandDto[],
    public readonly syncProductCost: boolean | undefined,
    public readonly createdById?: string,
  ) {}
}
