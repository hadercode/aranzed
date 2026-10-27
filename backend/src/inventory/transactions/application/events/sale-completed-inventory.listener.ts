import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SaleCompletedEvent } from '@/sales/domain/events/sale-completed.event';
import { WarehousesService } from '@/inventory/warehouses/application/services/warehouses.service';
import {
  INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN,
  type IInventoryTransactionReadRepository,
} from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
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
import { CreateInventoryTransactionUseCase } from '../commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { CreateInventoryTransactionCommand } from '../commands/create-inventory-transaction/create-inventory-transaction.command';

@Injectable()
@EventsHandler(SaleCompletedEvent)
export class SaleCompletedInventoryListener implements IEventHandler<SaleCompletedEvent> {
  private readonly logger = new Logger(SaleCompletedInventoryListener.name);

  constructor(
    private readonly createTransactionUseCase: CreateInventoryTransactionUseCase,
    private readonly warehousesService: WarehousesService,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    @Inject(RECIPE_REPOSITORY_TOKEN)
    private readonly recipeRepository: IRecipeRepository,
    @Inject(INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN)
    private readonly readRepository: IInventoryTransactionReadRepository,
  ) {}

  async handle(event: SaleCompletedEvent): Promise<void> {
    try {
      this.logger.log(
        `[Inventory][EVENT_RECEIVED] Escuchando venta completada #${event.saleNumber} (ID: ${event.saleId}) con ${event.items.length} ítems.`,
      );

      // 1. Idempotencia: Verificar si ya existe una transacción de inventario para esta venta
      const existingTx = await this.readRepository.findByReference(
        'SALE',
        event.saleId,
      );

      if (existingTx) {
        this.logger.warn(
          `[Inventory][Idempotencia] La venta #${event.saleNumber} ya fue procesada previamente con la transacción ${existingTx.transactionNumber}. Omitiendo salida duplicada.`,
        );
        return;
      }

      // 2. Resolver almacén de origen (el especificado en la venta o fallback al principal/ventas)
      let originWarehouseId = event.warehouseId;
      if (!originWarehouseId) {
        const warehouses = await this.warehousesService.findAll();
        const activeWarehouses = warehouses.filter((w) => w.isActive);
        const salesWarehouse = activeWarehouses.find((w) => w.isSalesWarehouse);
        originWarehouseId = salesWarehouse?.id || activeWarehouses[0]?.id;
      }

      if (!originWarehouseId) {
        this.logger.error(
          `[Inventory] No se pudo procesar la salida de la venta #${event.saleNumber}: No existe ningún almacén activo configurado en el sistema.`,
        );
        return;
      }

      // 3. Mapear renglones para la salida de inventario (ISSUE), expandiendo recetas en sus ingredientes
      const itemsToIssue: Array<{
        productId: string;
        skuSnapshot: string;
        nameSnapshot: string;
        uomSymbol: string;
        quantity: number;
        cost: number;
        customComment: string;
      }> = [];

      for (const item of event.items || []) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) continue;

        // Verificar si el producto tiene una receta activa (BOM)
        const recipes = await this.recipeRepository.findByProductId(product.id);
        const activeRecipe = recipes.find(
          (r) => r.status === RecipeStatus.ACTIVE,
        );

        if (
          activeRecipe &&
          activeRecipe.items &&
          activeRecipe.items.length > 0
        ) {
          // Descontar la composición de la receta (ingredientes)
          const baseYield =
            activeRecipe.yieldQuantity > 0 ? activeRecipe.yieldQuantity : 1;
          const multiplier = Number(item.quantity) / baseYield;

          for (const recipeItem of activeRecipe.items) {
            const ingredient = await this.productRepository.findById(
              recipeItem.productId,
            );
            if (!ingredient) continue;

            // Descontar solo si maneja inventario y no es servicio
            if (
              ingredient.manageInventory &&
              ingredient.type !== ProductType.SERVICE
            ) {
              const neededQty = Number(recipeItem.quantity) * multiplier;
              itemsToIssue.push({
                productId: ingredient.id,
                skuSnapshot: ingredient.uom?.code
                  ? `${ingredient.name.slice(0, 3).toUpperCase()}-${ingredient.id.slice(0, 4).toUpperCase()}`
                  : ingredient.id.slice(0, 8).toUpperCase(),
                nameSnapshot: ingredient.name,
                uomSymbol: ingredient.uom?.code || 'UN',
                quantity: neededQty,
                cost: Number(recipeItem.unitCost || ingredient.lastCost || 0),
                customComment: `Ingrediente [${ingredient.name}] de receta [${activeRecipe.name}] para Venta #${event.saleNumber} (${item.quantity} ${item.name || item.description})`,
              });
            }
          }
        } else {
          // Producto tradicional o terminado sin receta
          if (product.manageInventory && product.type !== ProductType.SERVICE) {
            itemsToIssue.push({
              productId: item.productId,
              skuSnapshot: item.sku || item.productId.slice(0, 8).toUpperCase(),
              nameSnapshot: item.name || item.description,
              uomSymbol: item.uomSymbol || product.uom?.code || 'UN',
              quantity: Number(item.quantity),
              cost: Number(item.unitCost || product.lastCost || 0),
              customComment: `Salida automática por Venta #${event.saleNumber} [${item.productType}]`,
            });
          }
        }
      }

      if (itemsToIssue.length === 0) {
        this.logger.log(
          `[Inventory] La venta #${event.saleNumber} no contiene productos ni ingredientes que descuenten existencias físicas. Omitiendo salida de stock.`,
        );
        return;
      }

      // 4. Formatear fecha del movimiento (YYYY-MM-DD)
      const movementDate = event.saleDate
        ? typeof event.saleDate === 'string'
          ? (event.saleDate as string).slice(0, 10)
          : new Date(event.saleDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

      // 5. Crear la transacción de salida completada vía Use Case (descuenta existencias y genera Kárdex)
      const command = new CreateInventoryTransactionCommand({
        type: InventoryTransactionType.ISSUE,
        status: InventoryTransactionStatus.COMPLETED,
        originWarehouseId,
        movementDate,
        referenceEntityType: 'SALE',
        referenceEntityId: event.saleId,
        notes: `Salida automática por Venta #${event.saleNumber} - Cliente: ${event.customerName}`,
        items: itemsToIssue,
        createdById: event.createdById || undefined,
      });

      const createdTx = await this.createTransactionUseCase.execute(command);

      this.logger.log(
        `[Inventory][STOCK_DESCONTADO] Venta #${event.saleNumber} procesada exitosamente en inventario. ` +
          `Transacción: ${createdTx.transactionNumber}, Almacén Origen: ${originWarehouseId}, Renglones descontados: ${itemsToIssue.length}. Kárdex actualizado.`,
      );
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `[Inventory][ERROR] Error al procesar la salida de inventario para la venta #${event.saleNumber}: ${err?.message || String(error)}`,
        err?.stack,
      );
      throw error;
    }
  }
}
