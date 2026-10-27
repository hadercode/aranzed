import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SalePaymentStatusChangedEvent } from '@/sales/domain/events/sale-payment-status-changed.event';

@EventsHandler(SalePaymentStatusChangedEvent)
export class SalePaymentStatusChangedListener implements IEventHandler<SalePaymentStatusChangedEvent> {
  private readonly logger = new Logger(SalePaymentStatusChangedListener.name);

  async handle(event: SalePaymentStatusChangedEvent): Promise<void> {
    await Promise.resolve();

    this.logger.log(
      `[Event-Driven][ESTADO_PAGO_VENTA] Venta #${event.saleNumber} (ID: ${event.saleId}) cambió estado de pago: ` +
        `"${event.previousPaidStatus}" -> "${event.newPaidStatus}". ` +
        `Término: "${event.paymentTerm}" | Vence: ${
          event.dueDate ? new Date(event.dueDate).toLocaleDateString() : 'N/A'
        } | Cliente: "${event.customerName}" | ` +
        `Total: $${event.total.toFixed(2)} (${event.functionalCurrency}) / Bs.${event.totalLocal.toFixed(2)} (${event.localCurrency}). ` +
        `[Punto de Extensión Cobranzas]: Evento desacoplado listo para sincronizar Cuentas por Cobrar, Tesorería o Conciliación de Pagos.`,
    );
  }
}
