import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleCompletionService } from '@/sales/application/services';
import { UpdateSalePaidStatusCommand } from './update-sale-paid-status.command';

@Injectable()
export class UpdateSalePaidStatusUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: UpdateSalePaidStatusCommand): Promise<Sale> {
    const sale = await this.saleRepository.findById(command.id);
    if (!sale) {
      throw new NotFoundException(
        `La venta con ID "${command.id}" no fue encontrada`,
      );
    }

    if (sale.status === SaleStatus.CANCELLED) {
      throw new BadRequestException(
        'No se puede modificar el estado de pago de una venta anulada',
      );
    }

    if (sale.paidStatus === command.paidStatus) {
      return sale;
    }

    const previousPaidStatus = sale.paidStatus;
    // Delegar al método del agregado la regla de negocio y máquina de estado de pago
    sale.changePaidStatus(command.paidStatus);

    const saved = await this.saleRepository.save(sale);

    // Emitir evento desacoplado para cobranzas / tesorería
    await this.saleCompletionService.publishPaymentStatusChanged(
      saved,
      previousPaidStatus,
      saved.paidStatus,
      command.userId,
    );

    return saved;
  }
}
