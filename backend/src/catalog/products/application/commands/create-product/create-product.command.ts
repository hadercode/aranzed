import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly type: ProductType,
    public readonly uomId: string,
    public readonly description?: string,
    public readonly imageUrl?: string,
    public readonly categoryId?: string,
    public readonly profitMargin?: number,
    public readonly lastCost?: number,
    public readonly lastSalePrice?: number,
    public readonly isActive?: boolean,
    public readonly manageInventory?: boolean,
    public readonly createdById?: string,
  ) {}
}
