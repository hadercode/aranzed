import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import { PaymentStatus } from '@/sales/domain/enums/payment-status.enum';
import {
  SALE_PAYMENT_REPOSITORY_TOKEN,
  type ISalePaymentRepository,
} from '@/sales/domain/repositories/sale-payment.repository.interface';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleCompletionService } from '@/sales/application/services';
import { CancelSalePaymentCommand } from './cancel-sale-payment.command';

@Injectable()
export class CancelSalePaymentUseCase {
  constructor(
    @Inject(SALE_PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: ISalePaymentRepository,
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: CancelSalePaymentCommand): Promise<SalePayment> {
    const payment = await this.paymentRepository.findById(command.paymentId);
    if (!payment) {
      throw new NotFoundException(
        `El cobro con ID "${command.paymentId}" no fue encontrado`,
      );
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      throw new BadRequestException('El cobro ya se encuentra anulado');
    }

    payment.cancel();
    if (command.reason) {
      payment.notes = payment.notes
        ? `${payment.notes} | [ANULADO]: ${command.reason}`
        : `[ANULADO]: ${command.reason}`;
    }

    // Revertir montos aplicados a las ventas
    for (const alloc of payment.allocations) {
      const sale = await this.saleRepository.findById(alloc.saleId);
      if (sale) {
        const previousPaidStatus = sale.paidStatus;
        sale.revertPaymentAllocation(
          alloc.amountAllocated,
          alloc.amountAllocatedLocal,
          alloc.differenceAdjustment,
        );
        const savedSale = await this.saleRepository.save(sale);

        if (previousPaidStatus !== savedSale.paidStatus) {
          await this.saleCompletionService.publishPaymentStatusChanged(
            savedSale,
            previousPaidStatus,
            savedSale.paidStatus,
            command.userId,
          );
        }
      }
    }

    const savedPayment = await this.paymentRepository.save(payment);
    return savedPayment;
  }
}
