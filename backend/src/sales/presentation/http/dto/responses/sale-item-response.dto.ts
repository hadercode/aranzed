import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SaleItemProductSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  uomCode?: string;

  @ApiPropertyOptional()
  uomName?: string;

  @ApiPropertyOptional()
  imageUrl?: string | null;

  @ApiProperty()
  lastCost: number;

  @ApiProperty()
  lastSalePrice: number;
}

export class SaleItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  saleId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  productType: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  unitCost: number;

  @ApiProperty()
  discountRate: number;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  isTaxable: boolean;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  unitPriceLocal: number;

  @ApiProperty()
  subtotalLocal: number;

  @ApiProperty()
  discountAmountLocal: number;

  @ApiProperty()
  taxAmountLocal: number;

  @ApiProperty()
  totalLocal: number;

  @ApiProperty()
  currencySymbolFunctional: string;

  @ApiProperty()
  currencySymbolLocal: string;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ type: SaleItemProductSummaryDto })
  product?: SaleItemProductSummaryDto | null;
}
