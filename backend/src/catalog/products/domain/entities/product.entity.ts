import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { ProductType } from '../enums/product-type.enum';

export interface ProductUomSummary {
  id: string;
  code: string;
  name: string;
}

export interface ProductCategorySummary {
  id: string;
  name: string;
}

export class Product extends BaseEntity {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  type: ProductType;
  uomId: string;
  categoryId?: string | null;
  profitMargin: number;
  lastCost: number;
  lastSalePrice: number;
  isActive: boolean;
  manageInventory: boolean;
  createdById?: string | null;
  deletedAt?: Date | null;

  // Populated relation summaries
  uom?: ProductUomSummary | null;
  category?: ProductCategorySummary | null;

  constructor(partial: Partial<Product>) {
    super();
    Object.assign(this, partial);
    this.isActive = partial.isActive !== undefined ? partial.isActive : true;
    this.manageInventory =
      partial.manageInventory !== undefined
        ? Boolean(partial.manageInventory)
        : partial.type !== ProductType.SERVICE;
    this.profitMargin =
      partial.profitMargin !== undefined ? Number(partial.profitMargin) : 0;
    this.lastCost =
      partial.lastCost !== undefined ? Number(partial.lastCost) : 0;
    this.lastSalePrice =
      partial.lastSalePrice !== undefined ? Number(partial.lastSalePrice) : 0;
  }

  calculateSuggestedSalePrice(): number {
    const cost = Number(this.lastCost) || 0;
    const margin = Number(this.profitMargin) || 0;
    return Number((cost * (1 + margin / 100)).toFixed(4));
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleException('El nombre del producto es obligatorio');
    }
    if (this.name.length > 150) {
      throw new BusinessRuleException(
        'El nombre no puede superar los 150 caracteres',
      );
    }
    if (!this.type || !Object.values(ProductType).includes(this.type)) {
      throw new BusinessRuleException('El tipo de producto no es válido');
    }
    if (!this.uomId || this.uomId.trim().length === 0) {
      throw new BusinessRuleException(
        'La unidad de medida del producto es obligatoria',
      );
    }
    if (this.profitMargin < 0) {
      throw new BusinessRuleException(
        'El margen de ganancia no puede ser negativo',
      );
    }
    if (this.lastCost < 0) {
      throw new BusinessRuleException('El costo no puede ser negativo');
    }
    if (this.lastSalePrice < 0) {
      throw new BusinessRuleException(
        'El precio de venta no puede ser negativo',
      );
    }
  }
}
