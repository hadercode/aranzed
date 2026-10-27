import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';

export class CreateInventoryTransactionItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'ID de la variante (si aplica)' })
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty({ description: 'SKU del producto al momento del movimiento' })
  @IsString()
  @IsNotEmpty()
  skuSnapshot: string;

  @ApiProperty({ description: 'Nombre descriptivo del producto' })
  @IsString()
  @IsNotEmpty()
  nameSnapshot: string;

  @ApiProperty({
    description: 'Símbolo de la unidad de medida principal (ej: UN, KG)',
  })
  @IsString()
  @IsNotEmpty()
  uomSymbol: string;

  @ApiProperty({ description: 'Cantidad a mover', example: 10 })
  @IsNumber()
  @Min(0.00001)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Costo unitario (solo para compras / entradas)',
  })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiPropertyOptional({
    description: 'Cantidad en unidad de medida secundaria',
  })
  @IsNumber()
  @IsOptional()
  secQuantity?: number;

  @ApiPropertyOptional({
    description: 'Símbolo de unidad de medida secundaria',
  })
  @IsString()
  @IsOptional()
  secUomSymbol?: string;

  @ApiPropertyOptional({ description: 'Número de lote' })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'Comentario u observación por renglón' })
  @IsString()
  @IsOptional()
  customComment?: string;
}

export class CreateInventoryTransactionDto {
  @ApiPropertyOptional({
    description: 'Número de transacción (generado automáticamente si se omite)',
  })
  @IsString()
  @IsOptional()
  transactionNumber?: string;

  @ApiProperty({
    description: 'Tipo de transacción',
    enum: InventoryTransactionType,
    example: InventoryTransactionType.RECEPTION,
  })
  @IsEnum(InventoryTransactionType)
  @IsNotEmpty()
  type: InventoryTransactionType;

  @ApiPropertyOptional({ description: 'ID del motivo de inventario' })
  @IsString()
  @IsOptional()
  reasonId?: string;

  @ApiPropertyOptional({
    description: 'ID del almacén origen (obligatorio para ISSUE y TRANSFER)',
  })
  @IsString()
  @IsOptional()
  originWarehouseId?: string;

  @ApiPropertyOptional({
    description:
      'ID del almacén destino (obligatorio para RECEPTION y TRANSFER)',
  })
  @IsString()
  @IsOptional()
  destWarehouseId?: string;

  @ApiPropertyOptional({
    description: 'Estado de la transacción',
    enum: InventoryTransactionStatus,
    default: InventoryTransactionStatus.DRAFT,
  })
  @IsEnum(InventoryTransactionStatus)
  @IsOptional()
  status?: InventoryTransactionStatus;

  @ApiPropertyOptional({
    description: 'Fecha del movimiento (YYYY-MM-DD)',
    default: 'hoy',
  })
  @IsDateString()
  @IsOptional()
  movementDate?: string;

  @ApiPropertyOptional({
    description:
      'Tipo de entidad de referencia (ej: PURCHASE_RECEIPT, SALES_ORDER)',
  })
  @IsString()
  @IsOptional()
  referenceEntityType?: string;

  @ApiPropertyOptional({ description: 'ID de la entidad de referencia' })
  @IsString()
  @IsOptional()
  referenceEntityId?: string;

  @ApiPropertyOptional({ description: 'Notas u observaciones generales' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Documentos adjuntos (URLs)',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  documents?: string[];

  @ApiProperty({
    description: 'Lista de ítems de la transacción',
    type: [CreateInventoryTransactionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryTransactionItemDto)
  items: CreateInventoryTransactionItemDto[];
}
