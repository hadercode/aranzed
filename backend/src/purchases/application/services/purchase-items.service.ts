import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PurchaseItem } from '@/purchases/domain/entities/purchase-item.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { PURCHASE_REPOSITORY_TOKEN } from '@/purchases/domain/repositories/purchase.repository.interface';
import type { IPurchaseRepository } from '@/purchases/domain/repositories/purchase.repository.interface';
import { PRODUCT_REPOSITORY_TOKEN } from '@/catalog/products/domain/repositories/product.repository.interface';
import type { IProductRepository } from '@/catalog/products/domain/repositories/product.repository.interface';
import {
  PurchaseItemCommandMapper,
  PurchaseItemCommandDto,
} from '@/purchases/application/mappers';

export interface BuildPurchaseItemsContext {
  purchaseId: string;
  exchangeRate: number;
  documentCurrency: string;
  localCurrency: string;
}

/**
 * Servicio de Aplicación para operaciones comunes sobre renglones de compra:
 * - Validación de existencia de renglones y unicidad de factura.
 * - Resolución de números correlativos.
 * - Validación de catálogo de materiales y transformación hacia entidades de Dominio.
 */
@Injectable()
export class PurchaseItemsService {
  constructor(
    @Inject(PURCHASE_REPOSITORY_TOKEN)
    private readonly purchaseRepository: IPurchaseRepository,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  /**
   * Garantiza que la compra incluya al menos un material.
   */
  ensureHasItems(items?: unknown[]): void {
    if (!items || items.length === 0) {
      throw new BusinessRuleException(
        'La compra debe contener al menos un material en su detalle',
      );
    }
  }

  /**
   * Valida que no exista otra compra registrada con el mismo número de factura para el mismo proveedor.
   * Permite excluir opcionalmente el ID de compra actual al editar.
   */
  async validateUniqueInvoice(
    invoiceNumber: string,
    supplierName: string,
    excludePurchaseId?: string,
  ): Promise<void> {
    const existing = await this.purchaseRepository.findByInvoiceNumber(
      invoiceNumber.trim(),
    );
    if (
      existing &&
      existing.id !== excludePurchaseId &&
      existing.supplierName.trim().toLowerCase() ===
        supplierName.trim().toLowerCase()
    ) {
      throw new ConflictException(
        `Ya existe una compra registrada con la factura "${invoiceNumber}" para el proveedor "${supplierName}"`,
      );
    }
  }

  /**
   * Resuelve el número correlativo de compra o valida que el provisto no esté duplicado.
   */
  async resolvePurchaseNumber(purchaseNumber?: string): Promise<string> {
    const trimmed = purchaseNumber?.trim();
    if (!trimmed) {
      return this.purchaseRepository.getNextSequenceNumber();
    }

    const existing =
      await this.purchaseRepository.findByPurchaseNumber(trimmed);
    if (existing) {
      throw new ConflictException(
        `Ya existe una compra con el número correlativo "${trimmed}"`,
      );
    }
    return trimmed;
  }

  /**
   * Valida existencia de materiales en catálogo y mapea ítems a entidades de Dominio PurchaseItem.
   * Preserva el ID si ya existe (edición) o asigna uno nuevo vía UUID.
   */
  async buildPurchaseItems(
    items: PurchaseItemCommandDto[],
    context: BuildPurchaseItemsContext,
  ): Promise<PurchaseItem[]> {
    const purchaseItems: PurchaseItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const dto = items[i];
      const material = await this.productRepository.findById(dto.materialId);
      if (!material) {
        throw new BusinessRuleException(
          `El material con ID "${dto.materialId}" no existe en el catálogo`,
        );
      }

      const item = PurchaseItemCommandMapper.toDomain(
        {
          id: dto.id || randomUUID(),
          materialId: dto.materialId,
          description: dto.description?.trim() || material.name,
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          unitCostLocal: dto.unitCostLocal,
          currencySymbolFunctional: dto.currencySymbolFunctional,
          currencySymbolLocal: dto.currencySymbolLocal,
          isTaxable: dto.isTaxable,
          taxRate: dto.taxRate,
          sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : i,
          batchNumber: dto.batchNumber,
          expiryDate: dto.expiryDate,
        },
        {
          purchaseId: context.purchaseId,
          exchangeRate: context.exchangeRate,
          documentCurrency: context.documentCurrency,
          localCurrency: context.localCurrency,
          sortOrder: i,
          fallbackDescription: material.name,
        },
      );

      item.validate();
      purchaseItems.push(item);
    }

    return purchaseItems;
  }
}
