import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaleCancelledEvent } from '@/sales/domain/events/sale-cancelled.event';

@EventsHandler(SaleCancelledEvent)
export class SaleCancelledListener implements IEventHandler<SaleCancelledEvent> {
  private readonly logger = new Logger(SaleCancelledListener.name);

  async handle(event: SaleCancelledEvent): Promise<void> {
    await Promise.resolve();

    this.logger.warn(
      `[Event-Driven][VENTA_ANULADA] Venta #${event.saleNumber} (ID: ${event.saleId}) anulada. ` +
        `Razón: "${event.reason || 'Sin motivo especificado'}". ` +
        `[Punto de Extensión Inventario]: Listo para revertir salidas o reservas de stock.`,
    );
  }
}
