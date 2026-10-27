import { randomUUID } from 'crypto';
import { SaleItem } from '@/sales/domain/entities/sale-item.entity';

export interface SaleItemCommandDto {
  id?: string;
  productId: string;
  description?: string;
  productType?: string;
  quantity: number;
  unitPrice: number;
  unitCost?: number;
  discountRate?: number;
  isTaxable?: boolean;
  taxRate?: number;
  sortOrder?: number;
}

export interface SaleItemCommandContext {
  saleId: string;
  exchangeRate: number;
  sortOrder: number;
  fallbackDescription?: string;
  productType?: string;
  catalogCost?: number;
}

export class SaleItemCommandMapper {
  static toDomain(
    dto: SaleItemCommandDto,
    context: SaleItemCommandContext,
  ): SaleItem {
    const rate =
      context.exchangeRate !== undefined && Number(context.exchangeRate) > 0
        ? Number(context.exchangeRate)
        : 1.0;
    const sortOrder =
      dto.sortOrder !== undefined ? dto.sortOrder : context.sortOrder;

    return new SaleItem(
      {
        id: dto.id || randomUUID(),
        saleId: context.saleId,
        productId: dto.productId,
        description:
          dto.description?.trim() ||
          context.fallbackDescription ||
          'Producto en venta',
        productType: dto.productType || context.productType || 'TRADITIONAL',
        quantity: Number(dto.quantity) || 1,
        unitPrice: Number(dto.unitPrice) || 0,
        unitCost:
          dto.unitCost !== undefined
            ? Number(dto.unitCost)
            : Number(context.catalogCost) || 0,
        discountRate: Number(dto.discountRate) || 0,
        isTaxable: dto.isTaxable !== undefined ? Boolean(dto.isTaxable) : true,
        taxRate: dto.taxRate !== undefined ? Number(dto.taxRate) : 16.0,
        sortOrder,
        currencySymbolFunctional: '$',
        currencySymbolLocal: 'Bs.',
      },
      rate,
    );
  }

  static fromDto(
    dto: SaleItemCommandDto,
    context: SaleItemCommandContext,
  ): SaleItem {
    return SaleItemCommandMapper.toDomain(dto, context);
  }
}
