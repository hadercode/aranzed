import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import { SaleCommandMapper } from '@/sales/application/mappers';
import {
  SaleItemsService,
  SaleCompletionService,
} from '@/sales/application/services';
import { CreateSaleCommand } from './create-sale.command';

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleItemsService: SaleItemsService,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: CreateSaleCommand): Promise<Sale> {
    this.saleItemsService.ensureHasItems(command.items);

    // 1. Resolver correlativo si no viene dado o verificar unicidad
    const saleNumber = await this.saleItemsService.resolveSaleNumber(
      command.saleType,
      command.saleNumber,
    );

    // 2. Resolver monedas y tasa
    const currencies = SaleCommandMapper.resolveCurrencies(command);

    // 3. Crear identificador y validar ítems con SaleItemsService
    const saleId = randomUUID();
    const saleItems = await this.saleItemsService.buildSaleItems(
      command.items,
      {
        saleId,
        ...currencies,
      },
    );

    // 4. Si el estado inicial es COMPLETED, resolver almacén y validar existencias físicas antes de persistir
    if (command.status === SaleStatus.COMPLETED) {
      const warehouseId = await this.saleItemsService.resolveWarehouseId(
        command.warehouseId,
      );
      command.warehouseId = warehouseId;
      await this.saleItemsService.validateStockAvailability(
        command.items,
        warehouseId,
      );
    }

    // 5. Instanciar agregado Sale con SaleCommandMapper
    const sale = SaleCommandMapper.toDomain(
      {
        ...command,
        id: saleId,
        saleNumber,
        ...currencies,
      },
      saleItems,
    );

    sale.validate();

    // 5. Persistir de forma transaccional atómica
    const saved = await this.saleRepository.save(sale);

    // 6. Si se crea directamente en estado COMPLETED: emitir evento desacoplado para inventario
    if (saved.status === SaleStatus.COMPLETED) {
      await this.saleCompletionService.completeSale(saved);
    }

    // 7. Si se crea con estado de pago ABONADO o PAGADO: emitir evento de cobranza
    if (
      saved.paidStatus === SalePaidStatus.ABONADO ||
      saved.paidStatus === SalePaidStatus.PAGADO
    ) {
      await this.saleCompletionService.publishPaymentStatusChanged(
        saved,
        SalePaidStatus.PENDIENTE,
        saved.paidStatus,
        command.createdById || undefined,
      );
    }

    return saved;
  }
}
