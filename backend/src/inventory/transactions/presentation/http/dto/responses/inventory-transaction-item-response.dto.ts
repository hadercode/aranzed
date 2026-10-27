import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryTransactionItemResponseDto {
  @ApiProperty({ description: 'ID del ítem' })
  id: string;

  @ApiPropertyOptional({ description: 'ID de la transacción cabecera' })
  transactionId?: string;

  @ApiProperty({ description: 'ID del producto' })
  productId: string;

  @ApiPropertyOptional({ description: 'Información básica del producto' })
  product?: {
    id: string;
    name: string;
    sku?: string;
    imageUrl?: string | null;
  } | null;

  @ApiPropertyOptional({ description: 'ID de la variante' })
  variantId?: string | null;

  @ApiProperty({ description: 'SKU del producto al momento del movimiento' })
  skuSnapshot: string;

  @ApiProperty({ description: 'Nombre descriptivo del producto' })
  nameSnapshot: string;

  @ApiProperty({ description: 'Símbolo de la unidad de medida principal' })
  uomSymbol: string;

  @ApiProperty({ description: 'Cantidad movida' })
  quantity: number;

  @ApiPropertyOptional({ description: 'Costo unitario registrado' })
  cost?: number | null;

  @ApiPropertyOptional({ description: 'Cantidad en unidad secundaria' })
  secQuantity?: number | null;

  @ApiPropertyOptional({ description: 'Símbolo de la unidad secundaria' })
  secUomSymbol?: string | null;

  @ApiPropertyOptional({ description: 'Número de lote' })
  batchNumber?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento (ISO 8601)' })
  expiryDate?: string | null;

  @ApiPropertyOptional({ description: 'Observación del renglón' })
  customComment?: string | null;
}
