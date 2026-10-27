import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleCompletionService } from '@/sales/application/services';
import { CloseSaleManuallyCommand } from './close-sale-manually.command';

@Injectable()
export class CloseSaleManuallyUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
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
      command.differenceAdjustment > 0 ? command.differenceAdjustment : balance;

    sale.closeManually(diff, command.reason);

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
