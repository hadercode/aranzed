import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { RecipeStatus } from '../enums/recipe-status.enum';
import { RecipeItem } from './recipe-item.entity';

export interface RecipeProductSummary {
  id: string;
  name: string;
  type: string;
  uomCode?: string;
  uomName?: string;
  lastCost: number;
  lastSalePrice: number;
}

export class Recipe extends BaseEntity {
  code: string;
  name: string;
  description?: string | null;
  productId: string;
  status: RecipeStatus;
  yieldQuantity: number;
  totalCost: number;
  createdById?: string | null;
  deletedAt?: Date | null;

  items: RecipeItem[];
  product?: RecipeProductSummary | null;

  constructor(partial: Partial<Recipe>) {
    super();
    Object.assign(this, partial);
    this.status = partial.status || RecipeStatus.DRAFT;
    this.yieldQuantity =
      partial.yieldQuantity !== undefined ? Number(partial.yieldQuantity) : 1;
    this.totalCost =
      partial.totalCost !== undefined ? Number(partial.totalCost) : 0;
    this.items = partial.items
      ? partial.items.map((i) =>
          i instanceof RecipeItem ? i : new RecipeItem(i),
        )
      : [];
  }

  calculateTotalCost(): number {
    let sum = 0;
    for (const item of this.items) {
      sum += item.calculateSubtotal();
    }
    this.totalCost = Number(sum.toFixed(4));
    return this.totalCost;
  }

  getUnitCost(): number {
    const yieldQty = this.yieldQuantity > 0 ? this.yieldQuantity : 1;
    return Number((this.totalCost / yieldQty).toFixed(4));
  }

  validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new BusinessRuleException('El código de la receta es obligatorio');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleException('El nombre de la receta es obligatorio');
    }
    if (!this.productId) {
      throw new BusinessRuleException(
        'El producto terminado a fabricar es obligatorio',
      );
    }
    if (this.yieldQuantity <= 0) {
      throw new BusinessRuleException(
        'El rendimiento base debe ser mayor a cero',
      );
    }
    if (!this.status || !Object.values(RecipeStatus).includes(this.status)) {
      throw new BusinessRuleException('El estado de la receta no es válido');
    }

    // Verify self-referencing check
    for (const item of this.items) {
      if (item.productId === this.productId) {
        throw new BusinessRuleException(
          'Un producto no puede ser componente o ingrediente de su propia receta',
        );
      }
      item.validate();
    }
  }
}
