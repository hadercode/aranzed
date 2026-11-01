import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SalePayment } from '@/sales/domain/entities/sale-payment.entity';
import { SalePaymentAllocation } from '@/sales/domain/entities/sale-payment-allocation.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import { PaymentMethod } from '@/sales/domain/enums/payment-method.enum';
import { PaymentStatus } from '@/sales/domain/enums/payment-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  SALE_PAYMENT_WRITE_REPOSITORY_TOKEN,
  type ISalePaymentRepository,
} from '@/sales/domain/repositories/sale-payment.repository.interface';
import { SaleCompletionService } from '@/sales/application/services';
import { CloseSaleManuallyCommand } from './close-sale-manually.command';

@Injectable()
export class CloseSaleManuallyUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    @Inject(SALE_PAYMENT_WRITE_REPOSITORY_TOKEN)
    private readonly paymentRepository: ISalePaymentRepository,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: CloseSaleManuallyCommand): Promise<Sale> {
    const sale = await this.saleRepository.findById(command.saleId);
    if (!sale) {
      throw new NotFoundException(
        `La venta con ID "${command.saleId}" no fue encontrada`,
      );
    }

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException(
        'No se puede cerrar una venta que se encuentra anulada',
      );
    }

    if (sale.paidStatus === SalePaidStatus.PAGADO) {
      return sale;
    }

    const previousPaidStatus = sale.paidStatus;
    const { balance } = sale.getBalance();

    // Si el usuario no especificó la diferencia exacta, tomar el saldo restante completo
    const diff =
      command.differenceAdjustment > 0
        ? Number(command.differenceAdjustment.toFixed(4))
        : balance;

    if (diff <= 0) {
      return sale;
    }

    const rate = sale.exchangeRate > 0 ? sale.exchangeRate : 1.0;
    const diffLocal = Number((diff * rate).toFixed(4));

    // 1. Generar asiento de cobro formal de ajuste en el módulo de pagos
    const paymentNumber = await this.paymentRepository.getNextSequenceNumber();
    const paymentId = randomUUID();

    const payment = new SalePayment({
      id: paymentId,
      paymentNumber,
      customerName: sale.customerName,
      customerTaxId: sale.customerTaxId || null,
      paymentDate: new Date(),
      paymentMethod: PaymentMethod.ADJUSTMENT,
      reference: 'CIERRE-MANUAL',
      amount: diff,
      amountLocal: diffLocal,
      exchangeRate: rate,
      currency: sale.documentCurrency || 'USD',
      notes: command.reason
        ? `Cierre manual: ${command.reason.trim()}`
        : 'Ajuste de saldo por cierre manual',
      status: PaymentStatus.CONFIRMED,
      createdById: command.userId || null,
      allocations: [
        new SalePaymentAllocation({
          id: randomUUID(),
          paymentId,
          saleId: sale.id,
          amountAllocated: diff,
          amountAllocatedLocal: diffLocal,
          differenceAdjustment: 0,
          notes: command.reason?.trim() || 'Ajuste de saldo / Cierre manual',
        }),
      ],
    });

    await this.paymentRepository.save(payment);

    // 2. Aplicar la imputación del cobro de ajuste a la venta
    sale.applyPaymentAllocation(diff, diffLocal, 0);

    const note = `[CIERRE MANUAL]: Ajuste de $${diff.toFixed(2)}${command.reason ? ` - Motivo: ${command.reason.trim()}` : ''}`;
    sale.notes = sale.notes ? `${sale.notes} | ${note}` : note;

    const saved = await this.saleRepository.save(sale);

    await this.saleCompletionService.publishPaymentStatusChanged(
      saved,
      previousPaidStatus,
      saved.paidStatus,
      command.userId,
    );

    return saved;
  }
}
