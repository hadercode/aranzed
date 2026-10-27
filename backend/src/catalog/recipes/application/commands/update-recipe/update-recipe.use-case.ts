import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Recipe } from '@/catalog/recipes/domain/entities/recipe.entity';
import { RecipeItem } from '@/catalog/recipes/domain/entities/recipe-item.entity';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import type { IRecipeRepository } from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import {
  BusinessRuleException,
  EntityNotFoundException,
} from '@/core/domain/domain-exception';
import { UpdateRecipeCommand } from './update-recipe.command';

@Injectable()
export class UpdateRecipeUseCase {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: UpdateRecipeCommand): Promise<Recipe> {
    const existing = await this.recipeRepository.findById(command.id);
    if (!existing) {
      throw new EntityNotFoundException('Receta', command.id);
    }

    // 1. Validate code uniqueness if updating code
    if (command.code && command.code !== existing.code) {
      const codeDuplicate = await this.recipeRepository.findByCode(
        command.code.trim(),
      );
      if (codeDuplicate && codeDuplicate.id !== existing.id) {
        throw new BusinessRuleException(
          `El código "${command.code}" ya está en uso por otra receta`,
        );
      }
      existing.code = command.code.trim();
    }

    if (command.name !== undefined) {
      existing.name = command.name.trim();
    }
    if (command.description !== undefined) {
      existing.description = command.description?.trim() || null;
    }
    if (command.yieldQuantity !== undefined) {
      existing.yieldQuantity = Number(command.yieldQuantity) || 1;
    }

    // 2. Validate product if changing
    const targetProductId = command.productId || existing.productId;
    if (command.productId && command.productId !== existing.productId) {
      const parentProduct = await this.productRepository.findById(
        command.productId,
      );
      if (!parentProduct) {
        throw new BusinessRuleException(
          'El producto terminado especificado no existe',
        );
      }
      existing.productId = command.productId;
    }

    // 3. Status changes
    if (command.status !== undefined) {
      existing.status = command.status;
      if (existing.status === RecipeStatus.ACTIVE) {
        const otherRecipes =
          await this.recipeRepository.findByProductId(targetProductId);
        for (const r of otherRecipes) {
          if (r.id !== existing.id && r.status === RecipeStatus.ACTIVE) {
            r.status = RecipeStatus.INACTIVE;
            await this.recipeRepository.save(r);
          }
        }
      }
    }

    // 4. Update items if provided
    if (command.items !== undefined) {
      existing.items = command.items.map((dto, index) => {
        const quantity = Number(dto.quantity) || 1;
        const unitCost = Number(dto.unitCost) || 0;
        return new RecipeItem({
          id: randomUUID(),
          recipeId: existing.id,
          productId: dto.productId,
          quantity,
          unitCost,
          subtotalCost: Number((quantity * unitCost).toFixed(4)),
          notes: dto.notes,
          sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : index,
        });
      });
    }

    existing.calculateTotalCost();
    existing.validate();

    const saved = await this.recipeRepository.save(existing);

    // 5. Optionally sync cost with parent product
    if (command.syncProductCost && saved.status === RecipeStatus.ACTIVE) {
      const parentProduct =
        await this.productRepository.findById(targetProductId);
      if (parentProduct) {
        parentProduct.lastCost = saved.getUnitCost();
        parentProduct.lastSalePrice =
          parentProduct.calculateSuggestedSalePrice();
        await this.productRepository.save(parentProduct);
      }
    }

    return saved;
  }
}
