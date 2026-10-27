import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export class PurchaseItemResponseDto {
  @ApiPropertyOptional({ example: 'b0e8c784-068b-4a56-8c2c-806fa1c5a935' })
  id?: string;

  @ApiPropertyOptional({ example: '861a86c7-3c58-45d2-a7ec-f458cf6809ec' })
  purchaseId?: string;

  @ApiProperty({ example: '7d348a27-cae9-4e1b-852a-cf398b15d2a7' })
  materialId: string;

  @ApiProperty({ example: 'Madera de Pino Cepillada' })
  description: string;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 25.5 })
  unitCost: number;

  @ApiPropertyOptional({ example: 1160.25 })
  unitCostLocal?: number;

  @ApiPropertyOptional({ example: '$' })
  currencySymbolFunctional?: string;

  @ApiPropertyOptional({ example: 'Bs.' })
  currencySymbolLocal?: string;

  @ApiProperty({ example: true })
  isTaxable: boolean;

  @ApiProperty({ example: 16.0 })
  taxRate: number;

  @ApiProperty({ example: 40.8 })
  taxAmount: number;

  @ApiPropertyOptional({ example: 1856.4 })
  taxAmountLocal?: number;

  @ApiProperty({ example: 255.0 })
  subtotal: number;

  @ApiPropertyOptional({ example: 11602.5 })
  subtotalLocal?: number;

  @ApiProperty({ example: 295.8 })
  total: number;

  @ApiPropertyOptional({ example: 13458.9 })
  totalLocal?: number;

  @ApiProperty({ example: 0 })
  sortOrder: number;

  @ApiPropertyOptional({ example: 'LOT-20261025-001' })
  batchNumber?: string | null;

  @ApiPropertyOptional({ example: '2027-10-25' })
  expiryDate?: string | null;

  @ApiPropertyOptional()
  material?: {
    id: string;
    name: string;
    type: string;
    uomCode?: string;
    uomName?: string;
    lastCost: number;
  } | null;
}

export class PurchaseResponseDto {
  @ApiProperty({ example: '861a86c7-3c58-45d2-a7ec-f458cf6809ec' })
  id: string;

  @ApiProperty({ example: 'COM-0001' })
  purchaseNumber: string;

  @ApiProperty({ example: 'Maderas del Norte C.A.' })
  supplierName: string;

  @ApiProperty({ example: '2026-10-25T12:00:00.000Z' })
  purchaseDate: string;

  @ApiPropertyOptional({ example: 'Compra de tablones para producción' })
  description?: string | null;

  @ApiProperty({ enum: PurchaseStatus, example: PurchaseStatus.DRAFT })
  status: PurchaseStatus;

  @ApiProperty({ example: 'FAC-2026-9901' })
  invoiceNumber: string;

  @ApiPropertyOptional({ example: 'c2e9b889-1c2a-4af8-8b6d-7cb9bd380a11' })
  warehouseId?: string | null;

  @ApiProperty({ example: 45.5 })
  exchangeRate: number;

  @ApiProperty({ example: 'USD' })
  functionalCurrency: string;

  @ApiProperty({ example: 'VES' })
  localCurrency: string;

  @ApiPropertyOptional({ example: 'USD' })
  documentCurrency?: string;

  @ApiProperty({ example: 255.0 })
  subtotal: number;

  @ApiProperty({ example: 40.8 })
  taxAmount: number;

  @ApiProperty({ example: 295.8 })
  total: number;

  @ApiProperty({ example: 11602.5 })
  subtotalLocal: number;

  @ApiProperty({ example: 1856.4 })
  taxAmountLocal: number;

  @ApiProperty({ example: 13458.9 })
  totalLocal: number;

  @ApiPropertyOptional({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  createdById?: string | null;

  @ApiPropertyOptional({ example: '2026-10-25T10:00:00.000Z' })
  createdAt?: string;

  @ApiPropertyOptional({ example: '2026-10-25T10:00:00.000Z' })
  updatedAt?: string;

  @ApiProperty({ type: [PurchaseItemResponseDto] })
  items: PurchaseItemResponseDto[];
}
