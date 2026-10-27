import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SaleItem } from '@/sales/domain/entities/sale-item.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  PRODUCT_REPOSITORY_TOKEN,
  type IProductRepository,
} from '@/catalog/products/domain/repositories/product.repository.interface';
import {
  RECIPE_REPOSITORY_TOKEN,
  type IRecipeRepository,
} from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import {
  SALE_INVENTORY_PORT_TOKEN,
  type ISaleInventoryPort,
} from '@/sales/application/ports';
import {
  SaleItemCommandMapper,
  SaleItemCommandDto,
} from '@/sales/application/mappers';

export interface BuildSaleItemsContext {
  saleId: string;
  exchangeRate: number;
  documentCurrency?: string;
  localCurrency?: string;
}

@Injectable()
export class SaleItemsService {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @Inject(RECIPE_REPOSITORY_TOKEN)
    private readonly recipeRepository: IRecipeRepository,
    @Inject(SALE_INVENTORY_PORT_TOKEN)
    private readonly inventoryPort: ISaleInventoryPort,
  ) {}

  ensureHasItems(items?: unknown[]): void {
    if (!items || items.length === 0) {
      throw new BusinessRuleException(
        'La venta o cotización debe contener al menos un producto en su detalle',
      );
    }
  }

  async resolveSaleNumber(
    saleType: SaleType = SaleType.DIRECT_SALE,
    saleNumber?: string,
  ): Promise<string> {
    const trimmed = saleNumber?.trim();
    if (!trimmed) {
      return this.saleRepository.getNextSequenceNumber(saleType);
    }

    const existing = await this.saleRepository.findBySaleNumber(trimmed);
    if (existing) {
      throw new ConflictException(
        `Ya existe un documento de venta registrado con el número "${trimmed}"`,
      );
    }
    return trimmed;
  }

  async resolveWarehouseId(warehouseId?: string | null): Promise<string> {
    return this.inventoryPort.resolveWarehouseId(warehouseId);
  }

  async validateStockAvailability(
    items: { productId: string; quantity: number }[],
    warehouseId?: string | null,
  ): Promise<void> {
    const targetWarehouseId = await this.resolveWarehouseId(warehouseId);

    // Mapa acumulador de cantidades físicas requeridas por producto físico:
    // productId -> { name, quantityNeeded, isIngredient, parentName }
    const requirementsMap = new Map<
      string,
      {
        name: string;
        quantityNeeded: number;
        isIngredient: boolean;
        parentName: string;
      }
    >();

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) continue;

      // Buscar si el producto posee una receta activa de formulación
      const recipes = await this.recipeRepository.findByProductId(product.id);
      const activeRecipe = recipes.find(
        (r) => r.status === RecipeStatus.ACTIVE,
      );

      if (activeRecipe && activeRecipe.items && activeRecipe.items.length > 0) {
        // Es un producto con receta: se valida la existencia de sus ingredientes
        const baseYield =
          activeRecipe.yieldQuantity > 0 ? activeRecipe.yieldQuantity : 1;
        const multiplier = Number(item.quantity) / baseYield;

        for (const recipeItem of activeRecipe.items) {
          const ingredient = await this.productRepository.findById(
            recipeItem.productId,
          );
          if (!ingredient) continue;

          // Solo validar existencias si el ingrediente maneja inventario y no es servicio
          if (
            ingredient.manageInventory &&
            ingredient.type !== ProductType.SERVICE
          ) {
            const needed = Number(recipeItem.quantity) * multiplier;
            const existing = requirementsMap.get(ingredient.id);
            if (existing) {
              existing.quantityNeeded += needed;
            } else {
              requirementsMap.set(ingredient.id, {
                name: ingredient.name,
                quantityNeeded: needed,
                isIngredient: true,
                parentName: product.name,
              });
            }
          }
        }
      } else {
        // Producto directo tradicional o terminado sin receta
        if (product.manageInventory && product.type !== ProductType.SERVICE) {
          const needed = Number(item.quantity);
          const existing = requirementsMap.get(product.id);
          if (existing) {
            existing.quantityNeeded += needed;
          } else {
            requirementsMap.set(product.id, {
              name: product.name,
              quantityNeeded: needed,
              isIngredient: false,
              parentName: product.name,
            });
          }
        }
      }
    }

    // Validar existencias físicas reales en el almacén de despacho
    for (const [productId, req] of requirementsMap.entries()) {
      const availableStock = await this.inventoryPort.getAvailableStock(
        productId,
        targetWarehouseId,
      );

      if (availableStock < req.quantityNeeded) {
        if (req.isIngredient) {
          throw new BadRequestException(
            `Stock insuficiente para el ingrediente "${req.name}" (requerido para la receta de "${req.parentName}"). Requerido: ${req.quantityNeeded.toFixed(2)}, Disponible en almacén: ${availableStock.toFixed(2)}.`,
          );
        } else {
          throw new BadRequestException(
            `Stock insuficiente para el producto "${req.name}". Requerido: ${req.quantityNeeded.toFixed(2)}, Disponible en almacén: ${availableStock.toFixed(2)}. No es posible vender sin existencias físicas.`,
          );
        }
      }
    }
  }

  async buildSaleItems(
    items: SaleItemCommandDto[],
    context: BuildSaleItemsContext,
  ): Promise<SaleItem[]> {
    const saleItems: SaleItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const dto = items[i];
      const product = await this.productRepository.findById(dto.productId);
      if (!product) {
        throw new BusinessRuleException(
          `El producto con ID "${dto.productId}" no existe en el catálogo`,
        );
      }

      if (!product.isActive) {
        throw new BusinessRuleException(
          `El producto "${product.name}" está inactivo y no puede ser comercializado`,
        );
      }

      let unitPriceUSD = Number(dto.unitPrice) || 0;
      if (unitPriceUSD <= 0) {
        unitPriceUSD = Number(product.lastSalePrice) || 0;
      }

      const item = SaleItemCommandMapper.toDomain(
        {
          id: dto.id || randomUUID(),
          productId: dto.productId,
          description: dto.description?.trim() || product.name,
          productType: product.type,
          quantity: Number(dto.quantity) || 1,
          unitPrice: unitPriceUSD,
          unitCost: Number(product.lastCost) || 0,
          discountRate: Number(dto.discountRate) || 0,
          isTaxable:
            dto.isTaxable !== undefined ? Boolean(dto.isTaxable) : true,
          taxRate: dto.taxRate !== undefined ? Number(dto.taxRate) : 16.0,
          sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : i,
        },
        {
          saleId: context.saleId,
          exchangeRate: context.exchangeRate,
          sortOrder: i,
          fallbackDescription: product.name,
          productType: product.type,
          catalogCost: Number(product.lastCost) || 0,
        },
      );

      item.validate();
      saleItems.push(item);
    }

    return saleItems;
  }
}
