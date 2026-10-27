import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import { SalePaymentAllocation } from '@/sales/domain/entities/sale-payment-allocation.entity';
import { PaymentStatus } from '@/sales/domain/enums/payment-status.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import {
  SALE_PAYMENT_WRITE_REPOSITORY_TOKEN,
  type ISalePaymentRepository,
} from '@/sales/domain/repositories/sale-payment.repository.interface';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleCompletionService } from '@/sales/application/services';
import { CreateSalePaymentCommand } from './create-sale-payment.command';

@Injectable()
export class CreateSalePaymentUseCase {
  constructor(
    @Inject(SALE_PAYMENT_WRITE_REPOSITORY_TOKEN)
    private readonly paymentRepository: ISalePaymentRepository,
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: CreateSalePaymentCommand): Promise<SalePayment> {
    if (!command.allocations || command.allocations.length === 0) {
      throw new BadRequestException(
        'Debe especificar al menos una venta para aplicar el cobro',
      );
    }

    const paymentNumber = await this.paymentRepository.getNextSequenceNumber();
    const paymentId = randomUUID();
    const rate = command.exchangeRate > 0 ? command.exchangeRate : 1.0;

    // 1. Construir las asignaciones
    const allocations: SalePaymentAllocation[] = command.allocations.map(
      (item) => {
        const allocUsd = Number(item.amountAllocated || 0);
        const allocLocal =
          item.amountAllocatedLocal !== undefined &&
          Number(item.amountAllocatedLocal) > 0
            ? Number(item.amountAllocatedLocal)
            : Number((allocUsd * rate).toFixed(4));
        const diffAdj = Number(item.differenceAdjustment || 0);

        return new SalePaymentAllocation({
          id: randomUUID(),
          paymentId,
          saleId: item.saleId,
          amountAllocated: allocUsd,
          amountAllocatedLocal: allocLocal,
          differenceAdjustment: diffAdj,
          notes: item.notes,
        });
      },
    );

    // 2. Construir el agregado de Cobro
    const amountLocal =
      command.amountLocal !== undefined && Number(command.amountLocal) > 0
        ? Number(command.amountLocal)
        : Number((command.amount * rate).toFixed(4));

    const payment = new SalePayment({
      id: paymentId,
      paymentNumber,
      customerName: command.customerName,
      customerTaxId: command.customerTaxId || null,
      paymentDate: command.paymentDate,
      paymentMethod: command.paymentMethod,
      reference: command.reference || null,
      amount: command.amount,
      amountLocal,
      exchangeRate: rate,
      currency: command.currency || 'USD',
      receiptUrl: command.receiptUrl || null,
      notes: command.notes || null,
      status: PaymentStatus.CONFIRMED,
      createdById: command.userId || null,
      allocations,
    });

    // Validar invariantes del cobro
    payment.validate();

    // 3. Aplicar cada asignación a la respectiva venta
    for (const alloc of payment.allocations) {
      const sale = await this.saleRepository.findById(alloc.saleId);
      if (!sale) {
        throw new NotFoundException(
          `La venta con ID "${alloc.saleId}" no existe`,
        );
      }

      if (sale.status === SaleStatus.CANCELLED) {
        throw new BadRequestException(
          `No se puede aplicar un cobro a la venta ${sale.saleNumber} porque está anulada`,
        );
      }

      const previousPaidStatus = sale.paidStatus;

      // Aplicar monto y ajuste de diferencia
      sale.applyPaymentAllocation(
        alloc.amountAllocated,
        alloc.amountAllocatedLocal,
        alloc.differenceAdjustment,
      );

      // Persistir la venta actualizada
      const savedSale = await this.saleRepository.save(sale);

      // Si cambió el estado de pago, publicar evento
      if (previousPaidStatus !== savedSale.paidStatus) {
        await this.saleCompletionService.publishPaymentStatusChanged(
          savedSale,
          previousPaidStatus,
          savedSale.paidStatus,
          command.userId,
        );
      }
    }

    // 4. Persistir el cobro y sus asignaciones
    const savedPayment = await this.paymentRepository.save(payment);
    return savedPayment;
  }
}
