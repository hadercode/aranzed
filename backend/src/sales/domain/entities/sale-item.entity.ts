import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export interface SaleItemProductSummary {
  id: string;
  name: string;
  type: string;
  uomCode?: string;
  uomName?: string;
  imageUrl?: string | null;
  lastCost: number;
  lastSalePrice: number;
}

export class SaleItem extends BaseEntity {
  saleId: string;
  productId: string;
  description: string;
  productType: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discountRate: number;
  discountAmount: number;
  isTaxable: boolean;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  sortOrder: number;

  // Bimoneda Local
  unitPriceLocal: number;
  unitCostLocal: number;
  subtotalLocal: number;
  discountAmountLocal: number;
  taxAmountLocal: number;
  totalLocal: number;
  currencySymbolFunctional: string;
  currencySymbolLocal: string;

  product?: SaleItemProductSummary | null;

  constructor(partial: Partial<SaleItem>, exchangeRate: number = 1.0) {
    super();
    Object.assign(this, partial);
    this.quantity =
      partial.quantity !== undefined ? Number(partial.quantity) : 1;
    this.unitPrice =
      partial.unitPrice !== undefined ? Number(partial.unitPrice) : 0;
    this.unitCost =
      partial.unitCost !== undefined ? Number(partial.unitCost) : 0;
    this.discountRate =
      partial.discountRate !== undefined ? Number(partial.discountRate) : 0;
    this.isTaxable =
      partial.isTaxable !== undefined ? Boolean(partial.isTaxable) : true;
    this.taxRate =
      partial.taxRate !== undefined ? Number(partial.taxRate) : 16.0;
    this.sortOrder =
      partial.sortOrder !== undefined ? Number(partial.sortOrder) : 0;
    this.productType = partial.productType || 'TRADITIONAL';

    this.currencySymbolFunctional = partial.currencySymbolFunctional || '$';
    this.currencySymbolLocal = partial.currencySymbolLocal || 'Bs.';

    this.calculateFinancials(exchangeRate);
  }

  calculateFinancials(exchangeRate: number = 1.0): void {
    const rate = exchangeRate > 0 ? exchangeRate : 1.0;

    // 1. Moneda Funcional (USD)
    const baseSubtotal = Number((this.quantity * this.unitPrice).toFixed(4));

    // Descuento
    const discountRate = Math.max(0, Math.min(100, this.discountRate || 0));
    this.discountRate = discountRate;
    this.discountAmount = Number(
      ((baseSubtotal * discountRate) / 100).toFixed(4),
    );

    const discountedSubtotal = Number(
      (baseSubtotal - this.discountAmount).toFixed(4),
    );
    this.subtotal = discountedSubtotal;

    // Impuesto (IVA)
    if (this.isTaxable) {
      const taxRate = this.taxRate >= 0 ? this.taxRate : 16.0;
      this.taxRate = taxRate;
      this.taxAmount = Number(
        ((discountedSubtotal * taxRate) / 100).toFixed(4),
      );
    } else {
      this.taxRate = 0;
      this.taxAmount = 0;
    }

    this.total = Number((this.subtotal + this.taxAmount).toFixed(4));

    // 2. Moneda Local (VES)
    this.unitPriceLocal = Number((this.unitPrice * rate).toFixed(4));
    this.unitCostLocal = Number((this.unitCost * rate).toFixed(4));
    this.subtotalLocal = Number((this.subtotal * rate).toFixed(4));
    this.discountAmountLocal = Number((this.discountAmount * rate).toFixed(4));
    this.taxAmountLocal = Number((this.taxAmount * rate).toFixed(4));
    this.totalLocal = Number((this.total * rate).toFixed(4));
  }

  validate(): void {
    if (!this.productId) {
      throw new BusinessRuleException('El producto a vender es obligatorio');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new BusinessRuleException('La descripción del ítem es obligatoria');
    }
    if (this.quantity <= 0) {
      throw new BusinessRuleException(
        'La cantidad vendida debe ser mayor a cero',
      );
    }
    if (this.unitPrice < 0) {
      throw new BusinessRuleException(
        'El precio unitario no puede ser negativo',
      );
    }
    if (this.discountRate < 0 || this.discountRate > 100) {
      throw new BusinessRuleException(
        'El descuento debe estar entre 0% y 100%',
      );
    }
    if (this.taxRate < 0) {
      throw new BusinessRuleException('La tasa de IVA no puede ser negativa');
    }
  }
}
