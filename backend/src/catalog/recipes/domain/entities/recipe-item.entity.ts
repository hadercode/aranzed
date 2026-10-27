import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export interface RecipeItemProductSummary {
  id: string;
  name: string;
  type: ProductType;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
}

export class RecipeItem extends BaseEntity {
  recipeId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  subtotalCost: number;
  notes?: string | null;
  sortOrder: number;

  product?: RecipeItemProductSummary | null;

  constructor(partial: Partial<RecipeItem>) {
    super();
    Object.assign(this, partial);
    this.quantity =
      partial.quantity !== undefined ? Number(partial.quantity) : 1;
    this.unitCost =
      partial.unitCost !== undefined ? Number(partial.unitCost) : 0;
    this.subtotalCost =
      partial.subtotalCost !== undefined
        ? Number(partial.subtotalCost)
        : Number((this.quantity * this.unitCost).toFixed(4));
    this.sortOrder = partial.sortOrder !== undefined ? partial.sortOrder : 0;
  }

  calculateSubtotal(): number {
    this.subtotalCost = Number((this.quantity * this.unitCost).toFixed(4));
    return this.subtotalCost;
  }

  validate(): void {
    if (!this.productId) {
      throw new BusinessRuleException(
        'El producto o servicio componente es obligatorio',
      );
    }
    if (this.quantity <= 0) {
      throw new BusinessRuleException('La cantidad debe ser mayor a cero');
    }
    if (this.unitCost < 0) {
      throw new BusinessRuleException(
        'El costo unitario no puede ser negativo',
      );
    }
  }
}
