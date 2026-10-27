import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MaterialPurchaseCompletedEvent } from '@/purchases/domain/events/material-purchase-completed.event';

@EventsHandler(MaterialPurchaseCompletedEvent)
export class MaterialPurchaseCompletedListener implements IEventHandler<MaterialPurchaseCompletedEvent> {
  private readonly logger = new Logger(MaterialPurchaseCompletedListener.name);

  async handle(event: MaterialPurchaseCompletedEvent): Promise<void> {
    await Promise.resolve();
    this.logger.log(
      `[Event-Driven][COMPRA_COMPLETADA] Compra #${event.purchaseNumber} (ID: ${event.purchaseId}) registrada con éxito. ` +
        `Proveedor: "${event.supplierName}", Factura: "${event.invoiceNumber}", ` +
        `Total: $${event.total.toFixed(2)}, Ítems: ${event.items.length}. ` +
        `[Punto de Extensión]: Este evento está listo para que el futuro listener de inventario dé entrada a stock a los materiales.`,
    );

    // Iteramos los materiales emitidos en el evento para fines de trazabilidad
    for (const item of event.items) {
      this.logger.debug(
        ` -> Material: ${item.materialId} | Cantidad: ${item.quantity} | Costo Unitario: $${item.unitCost} | Gravable: ${item.isTaxable ? 'Sí (16%)' : 'Exento'} | Subtotal: $${item.subtotal}`,
      );
    }
  }
}
