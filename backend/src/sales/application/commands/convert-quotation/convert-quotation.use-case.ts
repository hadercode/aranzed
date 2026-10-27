import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleItem } from '@/sales/domain/entities/sale-item.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import {
  SALE_REPOSITORY_TOKEN,
  type ISaleRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  SaleCompletionService,
  SaleItemsService,
} from '@/sales/application/services';
import { ConvertQuotationCommand } from './convert-quotation.command';

@Injectable()
export class ConvertQuotationUseCase {
  constructor(
    @Inject(SALE_REPOSITORY_TOKEN)
    private readonly saleRepository: ISaleRepository,
    private readonly saleItemsService: SaleItemsService,
    private readonly saleCompletionService: SaleCompletionService,
  ) {}

  async execute(command: ConvertQuotationCommand): Promise<Sale> {
    const quotation = await this.saleRepository.findById(command.quotationId);
    if (!quotation) {
      throw new NotFoundException(
        `La cotización con ID "${command.quotationId}" no fue encontrada`,
      );
    }

    if (quotation.saleType !== SaleType.QUOTATION) {
      throw new BadRequestException(
        'El documento indicado no es una cotización',
      );
    }

    if (quotation.status === SaleStatus.CANCELLED) {
      throw new BadRequestException(
        'No se puede convertir una cotización que ha sido anulada',
      );
    }

    // Generar correlativo para la nueva venta directa
    const saleNumber = await this.saleRepository.getNextSequenceNumber(
      SaleType.DIRECT_SALE,
    );
    const saleId = randomUUID();

    const saleItems = quotation.items.map(
      (it, idx) =>
        new SaleItem(
          {
            id: randomUUID(),
            saleId,
            productId: it.productId,
            description: it.description,
            productType: it.productType,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            unitCost: it.unitCost,
            discountRate: it.discountRate,
            isTaxable: it.isTaxable,
            taxRate: it.taxRate,
            sortOrder: idx,
            currencySymbolFunctional: it.currencySymbolFunctional,
            currencySymbolLocal: it.currencySymbolLocal,
          },
          quotation.exchangeRate,
        ),
    );

    const sale = new Sale({
      id: saleId,
      saleNumber,
      saleType: SaleType.DIRECT_SALE,
      paymentTerm: quotation.paymentTerm,
      dueDate: quotation.dueDate,
      paidStatus: quotation.paidStatus,
      status: command.targetStatus || SaleStatus.PENDING,
      customerName: quotation.customerName,
      customerTaxId: quotation.customerTaxId,
      customerEmail: quotation.customerEmail,
      customerPhone: quotation.customerPhone,
      customerAddress: quotation.customerAddress,
      notes: quotation.notes
        ? `${quotation.notes} (Convertida desde cotización ${quotation.saleNumber})`
        : `Convertida desde cotización ${quotation.saleNumber}`,
      paymentMethod: quotation.paymentMethod,
      paymentNotes: quotation.paymentNotes,
      saleDate: new Date(),
      validUntil: null,
      exchangeRate: quotation.exchangeRate,
      functionalCurrency: quotation.functionalCurrency,
      localCurrency: quotation.localCurrency,
      documentCurrency: quotation.documentCurrency,
      convertedFromQuotationId: quotation.id,
      createdById: command.userId || quotation.createdById,
      items: saleItems,
    });

    sale.calculateTotals();
    sale.validate();

    // Si la venta convertida queda como COMPLETED, resolver almacén y validar existencias físicas antes de persistir
    if (sale.status === SaleStatus.COMPLETED) {
      sale.warehouseId = await this.saleItemsService.resolveWarehouseId(
        sale.warehouseId,
      );
      await this.saleItemsService.validateStockAvailability(
        sale.items,
        sale.warehouseId,
      );
    }

    const saved = await this.saleRepository.save(sale);

    // Si la venta convertida queda como COMPLETED: emitir evento desacoplado para inventario
    if (saved.status === SaleStatus.COMPLETED) {
      await this.saleCompletionService.completeSale(saved);
    }

    return saved;
  }
}
