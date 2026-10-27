import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import { PURCHASE_REPOSITORY_TOKEN } from '@/purchases/domain/repositories/purchase.repository.interface';
import type { IPurchaseRepository } from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseCommandMapper } from '@/purchases/application/mappers';
import {
  PurchaseCompletionService,
  PurchaseItemsService,
} from '@/purchases/application/services';
import { UpdatePurchaseCommand } from './update-purchase.command';

@Injectable()
export class UpdatePurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly purchaseItemsService: PurchaseItemsService,
    private readonly purchaseCompletionService: PurchaseCompletionService,
  ) {}

  async execute(command: UpdatePurchaseCommand): Promise<Purchase> {
    this.purchaseItemsService.ensureHasItems(command.items);

    // 1. Verificar si la compra existe
    const purchase = await this.purchaseRepository.findById(command.id);
    if (!purchase) {
      throw new NotFoundException(
        `No se encontró la compra con ID "${command.id}"`,
      );
    }

    // 2. Verificar que no esté ya completada mediante el agregado de dominio
    purchase.ensureCanBeUpdated();

    // 3. Validar duplicidad de factura para el mismo proveedor (excluyendo el id actual)
    await this.purchaseItemsService.validateUniqueInvoice(
      command.invoiceNumber,
      command.supplierName,
      command.id,
    );

    // 4. Resolver tasa de cambio y monedas
    const currencies = PurchaseCommandMapper.resolveCurrencies({
      exchangeRate: command.exchangeRate || purchase.exchangeRate,
      functionalCurrency:
        command.functionalCurrency || purchase.functionalCurrency,
      localCurrency: command.localCurrency || purchase.localCurrency,
      documentCurrency: command.documentCurrency || purchase.documentCurrency,
    });

    // 5. Validar materiales y mapear renglones con PurchaseItemsService
    const purchaseItems = await this.purchaseItemsService.buildPurchaseItems(
      command.items,
      {
        purchaseId: purchase.id,
        ...currencies,
      },
    );

    const newStatus = command.status || purchase.status;

    // 6. Actualizar entidad
    purchase.supplierName = command.supplierName.trim();
    purchase.purchaseDate = command.purchaseDate
      ? new Date(command.purchaseDate)
      : purchase.purchaseDate;
    purchase.description = command.description?.trim() || null;
    purchase.invoiceNumber = command.invoiceNumber.trim();
    purchase.warehouseId =
      command.warehouseId !== undefined
        ? command.warehouseId
        : purchase.warehouseId;
    purchase.exchangeRate = currencies.exchangeRate;
    purchase.functionalCurrency = currencies.functionalCurrency;
    purchase.localCurrency = currencies.localCurrency;
    purchase.documentCurrency = currencies.documentCurrency;
    purchase.status = newStatus;
    purchase.items = purchaseItems;

    purchase.calculateTotals();
    purchase.validate();

    // 7. Persistir cambios
    const saved = await this.purchaseRepository.save(purchase);

    // 8. Si la compra pasa a COMPLETED, orquestar catálogo y eventos
    if (saved.status === PurchaseStatus.COMPLETED) {
      await this.purchaseCompletionService.completePurchase(saved);
    }

    return saved;
  }
}
