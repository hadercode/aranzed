import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  SaleItemsService,
  SaleCompletionService,
} from '@/sales/application/services';
import { UpdateSaleCommand } from './update-sale.command';

@Injectable()
export class UpdateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleItemsService: SaleItemsService,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: UpdateSaleCommand): Promise<Sale> {
    const existing = await this.saleRepository.findById(command.id);
    if (!existing) {
      throw new NotFoundException(
        `La venta o cotización con ID "${command.id}" no fue encontrada`,
      );
    }

    // Regla de dominio: validar que se pueda modificar
    existing.ensureCanBeUpdated();

    const previousStatus = existing.status;
    const previousPaidStatus = existing.paidStatus;

    // Actualizar campos de cabecera a través del método encapsulado del agregado
    existing.updateDetails({
      saleType: command.saleType,
      paymentTerm: command.paymentTerm,
      dueDate: command.dueDate ? new Date(command.dueDate) : null,
      customerName: command.customerName,
      customerTaxId: command.customerTaxId,
      customerEmail: command.customerEmail,
      customerPhone: command.customerPhone,
      customerAddress: command.customerAddress,
      notes: command.notes,
      paymentMethod: command.paymentMethod,
      paymentNotes: command.paymentNotes,
      saleDate: command.saleDate ? new Date(command.saleDate) : undefined,
      validUntil: command.validUntil ? new Date(command.validUntil) : null,
      warehouseId: command.warehouseId,
      exchangeRate: command.exchangeRate,
      functionalCurrency: command.functionalCurrency,
      localCurrency: command.localCurrency,
      documentCurrency: command.documentCurrency,
    });

    if (command.status !== undefined) {
      existing.transitionTo(command.status);
    }
    if (command.paidStatus !== undefined) {
      existing.changePaidStatus(command.paidStatus);
    }

    // Actualizar detalle si se especificó
    if (command.items && command.items.length > 0) {
      this.saleItemsService.ensureHasItems(command.items);
      const saleItems = await this.saleItemsService.buildSaleItems(
        command.items,
        {
          saleId: existing.id,
          exchangeRate: existing.exchangeRate,
          documentCurrency: existing.documentCurrency,
          localCurrency: existing.localCurrency,
        },
      );
      existing.items = saleItems;
    }

    existing.calculateTotals();
    existing.validate();

    // Si transiciona a COMPLETED, resolver almacén y validar existencias físicas antes de persistir
    if (
      previousStatus !== SaleStatus.COMPLETED &&
      existing.status === SaleStatus.COMPLETED
    ) {
      existing.warehouseId = await this.saleItemsService.resolveWarehouseId(
        existing.warehouseId,
      );
      await this.saleItemsService.validateStockAvailability(
        existing.items,
        existing.warehouseId,
      );
    }

    // Persistir atómicamente
    const saved = await this.saleRepository.save(existing);

    // Si transitó hacia COMPLETED: emitir evento desacoplado para inventario
    if (
      previousStatus !== SaleStatus.COMPLETED &&
      saved.status === SaleStatus.COMPLETED
    ) {
      await this.saleCompletionService.completeSale(saved);
    }

    // Si transitó hacia ABONADO o PAGADO: emitir evento para tesorería
    if (
      previousPaidStatus !== saved.paidStatus &&
      (saved.paidStatus === SalePaidStatus.ABONADO ||
        saved.paidStatus === SalePaidStatus.PAGADO)
    ) {
      await this.saleCompletionService.publishPaymentStatusChanged(
        saved,
        previousPaidStatus,
        saved.paidStatus,
        command.userId || undefined,
      );
    }

    return saved;
  }
}
