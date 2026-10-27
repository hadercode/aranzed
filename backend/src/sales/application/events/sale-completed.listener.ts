import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaleCompletedEvent } from '@/sales/domain/events/sale-completed.event';

@EventsHandler(SaleCompletedEvent)
export class SaleCompletedListener implements IEventHandler<SaleCompletedEvent> {
  private readonly logger = new Logger(SaleCompletedListener.name);

  async handle(event: SaleCompletedEvent): Promise<void> {
    await Promise.resolve();

    this.logger.log(
      `[Event-Driven][VENTA_COMPLETADA] Venta #${event.saleNumber} (ID: ${event.saleId}) confirmada con éxito. ` +
        `Cliente: "${event.customerName}", Total USD: $${event.total.toFixed(2)}, ` +
        `Total Local: Bs.${event.totalLocal.toFixed(2)}, Tasa: ${event.exchangeRate}, ` +
        `Ítems: ${event.items.length}.`,
    );

    for (const item of event.items) {
      this.logger.debug(
        ` -> Producto: ${item.productId} [${item.productType}] | Cantidad: ${item.quantity} | Precio: $${item.unitPrice} | Subtotal: $${item.subtotal}`,
      );
    }
  }
}
