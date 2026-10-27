import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Recipe } from '@/catalog/recipes/domain/entities/recipe.entity';
import { RecipeItem } from '@/catalog/recipes/domain/entities/recipe-item.entity';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import type { IRecipeRepository } from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { CreateRecipeCommand } from './create-recipe.command';

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateRecipeCommand): Promise<Recipe> {
    // 1. Verify parent product exists
    const parentProduct = await this.productRepository.findById(
      command.productId,
    );
    if (!parentProduct) {
      throw new BusinessRuleException(
        'El producto terminado especificado para la receta no existe',
      );
    }

    // 2. Resolve code
    let code = command.code?.trim();
    if (!code) {
      code = await this.recipeRepository.getNextSequenceCode();
    } else {
      const existing = await this.recipeRepository.findByCode(code);
      if (existing) {
        throw new BusinessRuleException(
          `Ya existe una receta con el código "${code}"`,
        );
      }
    }

    // 3. Resolve status: if setting to ACTIVE, deactivate any existing active recipe for this product
    const status = command.status || RecipeStatus.DRAFT;
    if (status === RecipeStatus.ACTIVE) {
      const existingRecipes = await this.recipeRepository.findByProductId(
        command.productId,
      );
      for (const r of existingRecipes) {
        if (r.status === RecipeStatus.ACTIVE) {
          r.status = RecipeStatus.INACTIVE;
          await this.recipeRepository.save(r);
        }
      }
    }

    // 4. Create and populate recipe items
    const recipeId = randomUUID();
    const items = (command.items || []).map((dto, index) => {
      const quantity = Number(dto.quantity) || 1;
      const unitCost = Number(dto.unitCost) || 0;
      return new RecipeItem({
        id: randomUUID(),
        recipeId,
        productId: dto.productId,
        quantity,
        unitCost,
        subtotalCost: Number((quantity * unitCost).toFixed(4)),
        notes: dto.notes,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : index,
      });
    });

    // 5. Construct Recipe aggregate
    const recipe = new Recipe({
      id: recipeId,
      code,
      name: command.name.trim(),
      description: command.description?.trim() || null,
      productId: command.productId,
      status,
      yieldQuantity: command.yieldQuantity ? Number(command.yieldQuantity) : 1,
      items,
      createdById:
        typeof command.createdById === 'string'
          ? command.createdById
          : undefined,
    });

    recipe.calculateTotalCost();
    recipe.validate();

    // 6. Save recipe
    const saved = await this.recipeRepository.save(recipe);

    // 7. Optionally sync product cost
    if (command.syncProductCost && status === RecipeStatus.ACTIVE) {
      const unitCost = saved.getUnitCost();
      parentProduct.lastCost = unitCost;
      parentProduct.lastSalePrice = parentProduct.calculateSuggestedSalePrice();
      await this.productRepository.save(parentProduct);
    }

    return saved;
  }
}
