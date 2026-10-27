import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { InventoryTransactionItemResponseDto } from './inventory-transaction-item-response.dto';

export class InventoryTransactionResponseDto {
  @ApiProperty({ description: 'ID único de la transacción' })
  id: string;

  @ApiProperty({ description: 'Número correlativo único (ej: TX-2026-00001)' })
  transactionNumber: string;

  @ApiProperty({
    enum: InventoryTransactionType,
    description: 'Tipo de transacción',
  })
  type: InventoryTransactionType;

  @ApiPropertyOptional({ description: 'ID del motivo de inventario' })
  reasonId?: string | null;

  @ApiPropertyOptional({ description: 'Motivo de inventario asociado' })
  reason?: {
    id: string;
    name: string;
    type: string;
  } | null;

  @ApiPropertyOptional({ description: 'ID del almacén de origen' })
  originWarehouseId?: string | null;

  @ApiPropertyOptional({ description: 'Almacén de origen asociado' })
  originWarehouse?: {
    id: string;
    name: string;
    code: string;
  } | null;

  @ApiPropertyOptional({ description: 'ID del almacén de destino' })
  destWarehouseId?: string | null;

  @ApiPropertyOptional({ description: 'Almacén de destino asociado' })
  destWarehouse?: {
    id: string;
    name: string;
    code: string;
  } | null;

  @ApiProperty({
    enum: InventoryTransactionStatus,
    description: 'Estado actual',
  })
  status: InventoryTransactionStatus;

  @ApiProperty({
    description: 'Fecha del movimiento en formato YYYY-MM-DD o ISO',
  })
  movementDate: string;

  @ApiPropertyOptional({ description: 'Tipo de entidad de referencia' })
  referenceEntityType?: string | null;

  @ApiPropertyOptional({ description: 'ID de la entidad de referencia' })
  referenceEntityId?: string | null;

  @ApiPropertyOptional({ description: 'Notas u observaciones' })
  notes?: string | null;

  @ApiPropertyOptional({
    description: 'URLs de documentos adjuntos',
    type: [String],
  })
  documents?: string[] | null;

  @ApiProperty({
    description: 'Renglones de productos que componen el movimiento',
    type: [InventoryTransactionItemResponseDto],
  })
  items: InventoryTransactionItemResponseDto[];

  @ApiPropertyOptional({ description: 'ID del usuario creador' })
  createdById?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de creación (ISO 8601)' })
  createdAt?: string;

  @ApiPropertyOptional({
    description: 'Fecha de última actualización (ISO 8601)',
  })
  updatedAt?: string;
}
