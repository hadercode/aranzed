import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export class InventoryTransactionItem extends BaseEntity {
  transactionId?: string;
  productId: string;
  variantId?: string | null;
  skuSnapshot: string;
  nameSnapshot: string;
  uomSymbol: string;
  quantity: number;
  cost?: number | null;
  secQuantity?: number | null;
  secUomSymbol?: string | null;
  batchNumber?: string | null;
  expiryDate?: Date | null;
  customComment?: string | null;
  tenantId?: string | null;
  companyId?: string | null;
  createdById?: string | null;

  // Relaciones cargadas opcionalmente para lectura
  product?: {
    id: string;
    name: string;
    sku?: string;
    imageUrl?: string | null;
  } | null;

  constructor(partial?: Partial<InventoryTransactionItem>) {
    super();
    if (partial) {
      Object.assign(this, partial);
      this.quantity = Number(partial.quantity) || 0;
      this.cost =
        partial.cost !== undefined && partial.cost !== null
          ? Number(partial.cost)
          : null;
      this.secQuantity =
        partial.secQuantity !== undefined && partial.secQuantity !== null
          ? Number(partial.secQuantity)
          : null;
      if (partial.expiryDate) {
        this.expiryDate =
          partial.expiryDate instanceof Date
            ? partial.expiryDate
            : new Date(partial.expiryDate);
      }
    }
  }

  validate(): void {
    if (!this.productId || this.productId.trim().length === 0) {
      throw new BusinessRuleException('El ID del producto es obligatorio');
    }
    if (!this.skuSnapshot || this.skuSnapshot.trim().length === 0) {
      throw new BusinessRuleException(
        'El SKU del producto en el snapshot es obligatorio',
      );
    }
    if (!this.nameSnapshot || this.nameSnapshot.trim().length === 0) {
      throw new BusinessRuleException(
        'El nombre del producto en el snapshot es obligatorio',
      );
    }
    if (!this.uomSymbol || this.uomSymbol.trim().length === 0) {
      throw new BusinessRuleException(
        'La unidad de medida del producto es obligatoria',
      );
    }
    if (typeof this.quantity !== 'number' || this.quantity <= 0) {
      throw new BusinessRuleException(
        `La cantidad para el ítem SKU ${this.skuSnapshot} debe ser mayor a cero`,
      );
    }
    if (this.cost !== null && this.cost !== undefined && this.cost < 0) {
      throw new BusinessRuleException(
        `El costo para el ítem SKU ${this.skuSnapshot} no puede ser negativo`,
      );
    }
  }
}
