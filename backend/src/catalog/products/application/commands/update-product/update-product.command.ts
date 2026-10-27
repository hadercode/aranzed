import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  imageUrl?: string;
  type?: ProductType;
  uomId?: string;
  categoryId?: string | null;
  profitMargin?: number;
  lastCost?: number;
  lastSalePrice?: number;
  isActive?: boolean;
  manageInventory?: boolean;
}

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateProductPayload,
  ) {}
}
