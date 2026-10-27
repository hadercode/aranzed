import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Purchase } from '@/purchases/domain/entities/purchase.entity';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import { PURCHASE_REPOSITORY_TOKEN } from '@/purchases/domain/repositories/purchase.repository.interface';
import type { IPurchaseRepository } from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseCommandMapper } from '@/purchases/application/mappers';
import {
  PurchaseCompletionService,
  PurchaseItemsService,
} from '@/purchases/application/services';
import { CreatePurchaseCommand } from './create-purchase.command';

@Injectable()
export class CreatePurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly purchaseItemsService: PurchaseItemsService,
    private readonly purchaseCompletionService: PurchaseCompletionService,
  ) {}

  async execute(command: CreatePurchaseCommand): Promise<Purchase> {
    this.purchaseItemsService.ensureHasItems(command.items);

    // 1. Validar no duplicidad de factura para el proveedor
    await this.purchaseItemsService.validateUniqueInvoice(
      command.invoiceNumber,
      command.supplierName,
    );

    // 2. Resolver código correlativo
    const purchaseNumber =
      await this.purchaseItemsService.resolvePurchaseNumber(
        command.purchaseNumber,
      );

    // 3. Resolver tasa de cambio y monedas
    const currencies = PurchaseCommandMapper.resolveCurrencies(command);

    // 4. Crear identificador y transformar ítems con PurchaseItemsService
    const purchaseId = randomUUID();
    const purchaseItems = await this.purchaseItemsService.buildPurchaseItems(
      command.items,
      {
        purchaseId,
        ...currencies,
      },
    );

    const status = command.status || PurchaseStatus.DRAFT;

    // 5. Instanciar agregado Purchase con PurchaseCommandMapper
    const purchase = PurchaseCommandMapper.toDomain(
      {
        ...command,
        id: purchaseId,
        purchaseNumber,
        status,
        ...currencies,
      },
      purchaseItems,
    );

    purchase.validate();

    // 6. Persistir compra
    const saved = await this.purchaseRepository.save(purchase);

    // 7. Si se crea con estado COMPLETED, orquestar catálogo y eventos
    if (saved.status === PurchaseStatus.COMPLETED) {
      await this.purchaseCompletionService.completePurchase(saved);
    }

    return saved;
  }
}
