import { Injectable, Inject } from '@nestjs/common';
import type { IRecipeRepository } from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import {
  EntityNotFoundException,
  BusinessRuleException,
} from '@/core/domain/domain-exception';

@Injectable()
export class SyncRecipeCostUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<{
    recipeId: string;
    productId: string;
    syncedCost: number;
    newSalePrice: number;
  }> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new EntityNotFoundException('Receta', id);
    }

    const product = await this.productRepository.findById(recipe.productId);
    if (!product) {
      throw new EntityNotFoundException('Producto terminado', recipe.productId);
    }

    const unitCost = recipe.getUnitCost();
    product.lastCost = unitCost;
    product.lastSalePrice = product.calculateSuggestedSalePrice();
    await this.productRepository.save(product);

    return {
      recipeId: recipe.id,
      productId: product.id,
      syncedCost: unitCost,
      newSalePrice: product.lastSalePrice,
    };
  }
}
