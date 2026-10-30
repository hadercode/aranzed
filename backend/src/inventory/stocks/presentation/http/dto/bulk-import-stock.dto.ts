import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import type {
  StockImportRowStatus,
  BulkStockImportItemValidation,
  BulkStockImportValidationResult,
  BulkStockImportSummary,
} from '@/inventory/stocks/application/models/stock-import.models';

export class BulkStockImportItemValidationDto
  implements BulkStockImportItemValidation
{
  @ApiProperty({ example: 2, description: 'Número de fila en el Excel' })
  @IsNumber()
  rowNumber: number;

  @ApiProperty({ example: 'uuid', description: 'ID referencial del artículo' })
  @IsOptional()
  @IsString()
  productId: string;

  @ApiProperty({ example: 'Arroz Premium 1kg', description: 'Nombre del artículo' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'UND', description: 'Símbolo de la unidad de medida' })
  @IsOptional()
  @IsString()
  uomSymbol: string;

  @ApiProperty({ example: 'Almacén Principal', description: 'Nombre del almacén destino' })
  @IsString()
  warehouseName: string;

  @ApiProperty({ example: 100, description: 'Cantidad física a ingresar' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1.5, description: 'Costo unitario del saldo inicial' })
  @IsNumber()
  unitCost: number;

  @ApiProperty({ example: 150, description: 'Costo total calculado' })
  @IsOptional()
  @IsNumber()
  totalCost: number;

  @ApiPropertyOptional({ example: 'LOTE-2026-A', description: 'Número de lote opcional' })
  @IsOptional()
  @IsString()
  batchNumber?: string | null;

  @ApiProperty({ example: '2026-10-29', description: 'Fecha de entrada del saldo' })
  @IsOptional()
  @IsString()
  entryDate: string;

  @ApiProperty({
    enum: ['VALID', 'INVALID', 'DUPLICATE', 'SKIPPED'],
    example: 'VALID',
    description: 'Estado de validación de la fila',
  })
  @IsOptional()
  @IsIn(['VALID', 'INVALID', 'DUPLICATE', 'SKIPPED'])
  status: StockImportRowStatus;

  @ApiProperty({
    type: [String],
    example: [],
    description: 'Errores detectados en la fila',
  })
  @IsOptional()
  @IsArray()
  errors: string[];

  @ApiPropertyOptional({
    type: [String],
    example: [],
    description: 'Advertencias de la fila',
  })
  @IsOptional()
  @IsArray()
  warnings?: string[];

  @ApiPropertyOptional({ description: 'ID del producto resuelto en BD' })
  @IsOptional()
  @IsString()
  resolvedProductId?: string | null;

  @ApiPropertyOptional({ description: 'ID del almacén resuelto en BD' })
  @IsOptional()
  @IsString()
  resolvedWarehouseId?: string | null;
}

export class BulkStockImportValidationResultDto
  implements BulkStockImportValidationResult
{
  @ApiProperty({ example: 25, description: 'Total de filas leídas' })
  totalRows: number;

  @ApiProperty({ example: 15, description: 'Filas válidas con cantidad > 0' })
  validCount: number;

  @ApiProperty({ example: 0, description: 'Filas duplicadas' })
  duplicateCount: number;

  @ApiProperty({ example: 0, description: 'Filas con errores' })
  invalidCount: number;

  @ApiProperty({ example: 10, description: 'Filas omitidas (cantidad en blanco o cero)' })
  skippedCount: number;

  @ApiProperty({ example: true, description: 'Indica si hay al menos una fila lista para procesar' })
  canProcess: boolean;

  @ApiProperty({
    type: [BulkStockImportItemValidationDto],
    description: 'Detalle fila por fila',
  })
  rows: BulkStockImportItemValidationDto[];
}

export class ExecuteBulkStockImportDto {
  @ApiProperty({
    type: [BulkStockImportItemValidationDto],
    description: 'Artículos validados para ingresar al inventario',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStockImportItemValidationDto)
  items: BulkStockImportItemValidationDto[];
}

export class BulkStockImportSummaryDto implements BulkStockImportSummary {
  @ApiProperty({ example: 15, description: 'Total de artículos procesados' })
  totalProcessed: number;

  @ApiProperty({ example: 15, description: 'Total de artículos cargados con éxito' })
  createdCount: number;

  @ApiProperty({ example: 0, description: 'Total de fallos' })
  failedCount: number;

  @ApiProperty({
    type: [Object],
    example: [],
    description: 'Errores durante la ejecución',
  })
  errors: Array<{
    rowNumber?: number;
    name?: string;
    message: string;
  }>;
}

