import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export interface PurchaseItemMaterialSummary {
  id: string;
  name: string;
  type: string;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
}

export class PurchaseItem extends BaseEntity {
  purchaseId: string;
  materialId: string;
  description: string;
  quantity: number;
  unitCost: number;
  isTaxable: boolean;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  sortOrder: number;

  // Bimoneda
  currencySymbolFunctional: string;
  currencySymbolLocal: string;
  unitCostLocal: number;
  subtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  // Trazabilidad de Lotes e Inventario
  batchNumber?: string | null;
  expiryDate?: Date | null;

  material?: PurchaseItemMaterialSummary | null;

  constructor(partial: Partial<PurchaseItem>, exchangeRate: number = 1.0) {
    super();
    Object.assign(this, partial);
    this.quantity =
      partial.quantity !== undefined ? Number(partial.quantity) : 1;
    this.unitCost =
      partial.unitCost !== undefined ? Number(partial.unitCost) : 0;
    this.isTaxable =
      partial.isTaxable !== undefined ? Boolean(partial.isTaxable) : true;
    this.taxRate =
      partial.taxRate !== undefined ? Number(partial.taxRate) : 16.0;
    this.sortOrder = partial.sortOrder !== undefined ? partial.sortOrder : 0;

    this.batchNumber = partial.batchNumber || null;
    this.expiryDate = partial.expiryDate ? new Date(partial.expiryDate) : null;

    this.currencySymbolFunctional = partial.currencySymbolFunctional || '$';
    this.currencySymbolLocal = partial.currencySymbolLocal || 'Bs.';

    this.calculateFinancials(exchangeRate);
  }

  calculateFinancials(exchangeRate: number = 1.0): void {
    const rate = exchangeRate > 0 ? exchangeRate : 1.0;

    // 1. Moneda Funcional (USD)
    const rawSubtotal = Number((this.quantity * this.unitCost).toFixed(4));
    this.subtotal = rawSubtotal;

    if (this.isTaxable) {
      const taxRate = this.taxRate > 0 ? this.taxRate : 16.0;
      this.taxRate = taxRate;
      this.taxAmount = Number(((rawSubtotal * taxRate) / 100).toFixed(4));
    } else {
      this.taxRate = 0;
      this.taxAmount = 0;
    }

    this.total = Number((this.subtotal + this.taxAmount).toFixed(4));

    // 2. Moneda Local (VES)
    this.unitCostLocal = Number((this.unitCost * rate).toFixed(4));
    this.subtotalLocal = Number((this.subtotal * rate).toFixed(4));
    this.taxAmountLocal = Number((this.taxAmount * rate).toFixed(4));
    this.totalLocal = Number((this.total * rate).toFixed(4));
  }

  validate(): void {
    if (!this.materialId) {
      throw new BusinessRuleException('El material a comprar es obligatorio');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new BusinessRuleException('La descripción del ítem es obligatoria');
    }
    if (this.quantity <= 0) {
      throw new BusinessRuleException(
        'La cantidad comprada debe ser mayor a cero',
      );
    }
    if (this.unitCost < 0) {
      throw new BusinessRuleException(
        'El costo unitario no puede ser negativo',
      );
    }
    if (this.taxRate < 0) {
      throw new BusinessRuleException('La tasa de IVA no puede ser negativa');
    }
  }
}
