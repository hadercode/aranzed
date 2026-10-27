import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { MaterialPurchaseCompletedEvent } from '@/purchases/domain/events/material-purchase-completed.event';
import {
  PRODUCT_REPOSITORY_TOKEN,
  type IProductRepository,
} from '@/catalog/products/domain/repositories/product.repository.interface';

/**
 * Listener del Bounded Context de Catálogo de Productos.
 * Reacciona a eventos de compras finalizadas para actualizar de forma desacoplada
 * el costo de referencia y recalcular el precio sugerido del producto.
 */
@EventsHandler(MaterialPurchaseCompletedEvent)
export class UpdateProductCostOnPurchaseListener implements IEventHandler<MaterialPurchaseCompletedEvent> {
  private readonly logger = new Logger(
    UpdateProductCostOnPurchaseListener.name,
  );

  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async handle(event: MaterialPurchaseCompletedEvent): Promise<void> {
    this.logger.log(
      `[Event-Driven] Sincronizando costos de catálogo para la compra #${event.purchaseNumber}...`,
    );

    for (const item of event.items) {
      const product = await this.productRepository.findById(item.materialId);
      if (product) {
        product.lastCost = item.unitCost;
        product.lastSalePrice = product.calculateSuggestedSalePrice();
        await this.productRepository.save(product);

        this.logger.debug(
          `Costo actualizado para producto "${product.name}" (${product.id}): ` +
            `Nuevo costo: $${product.lastCost}, Precio sugerido: $${product.lastSalePrice}`,
        );
      }
    }
  }
}
