import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import type {
  ImportRowStatus,
  BulkImportItemValidation,
  BulkImportValidationResult,
  BulkImportSummary,
} from '@/catalog/products/application/models/bulk-import.models';

export class BulkImportItemValidationDto implements BulkImportItemValidation {
  @ApiProperty({ example: 2, description: 'Número de fila en el archivo de Excel' })
  @IsNumber()
  rowNumber: number;

  @ApiProperty({ example: 'Arroz Premium 1kg', description: 'Nombre del artículo' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ProductType,
    example: ProductType.TRADITIONAL,
    description: 'Tipo de producto',
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ example: 'UND', description: 'Código o nombre de la unidad de medida ingresada' })
  @IsString()
  uomNameOrCode: string;

  @ApiPropertyOptional({ example: 'Alimentos', description: 'Nombre de la categoría ingresada' })
  @IsOptional()
  @IsString()
  categoryName?: string | null;

  @ApiPropertyOptional({ example: 'Arroz blanco grano largo', description: 'Descripción opcional' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: 'https://...', description: 'URL de imagen opcional' })
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiProperty({ example: 1.5, description: 'Costo base' })
  @IsNumber()
  lastCost: number;

  @ApiProperty({ example: 30, description: 'Margen de ganancia en porcentaje' })
  @IsNumber()
  profitMargin: number;

  @ApiProperty({ example: 1.95, description: 'Precio de venta final o calculado' })
  @IsNumber()
  lastSalePrice: number;

  @ApiProperty({ example: true, description: 'Indica si maneja inventario' })
  @IsBoolean()
  manageInventory: boolean;

  @ApiProperty({ example: true, description: 'Indica si el producto está activo' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    enum: ['VALID', 'INVALID', 'DUPLICATE'],
    example: 'VALID',
    description: 'Estado de la validación del registro',
  })
  @IsOptional()
  @IsIn(['VALID', 'INVALID', 'DUPLICATE'])
  status: ImportRowStatus;

  @ApiProperty({
    type: [String],
    example: [],
    description: 'Lista de errores encontrados en la fila',
  })
  @IsOptional()
  @IsArray()
  errors: string[];

  @ApiPropertyOptional({
    type: [String],
    example: [],
    description: 'Advertencias que no bloquean la importación',
  })
  @IsOptional()
  @IsArray()
  warnings?: string[];

  @ApiPropertyOptional({ description: 'ID de la unidad de medida resuelta en base de datos' })
  @IsOptional()
  @IsString()
  resolvedUomId?: string | null;

  @ApiPropertyOptional({ description: 'ID de la categoría resuelta en base de datos' })
  @IsOptional()
  @IsString()
  resolvedCategoryId?: string | null;
}

export class BulkImportValidationResultDto implements BulkImportValidationResult {
  @ApiProperty({ example: 25, description: 'Total de filas leídas con contenido' })
  totalRows: number;

  @ApiProperty({ example: 20, description: 'Total de filas válidas listas para importar' })
  validCount: number;

  @ApiProperty({ example: 3, description: 'Total de filas duplicadas (en archivo o en BD)' })
  duplicateCount: number;

  @ApiProperty({ example: 2, description: 'Total de filas con errores de datos o catálogos inexistentes' })
  invalidCount: number;

  @ApiProperty({ example: true, description: 'Indica si al menos hay una fila válida para procesar' })
  canProcess: boolean;

  @ApiProperty({
    type: [BulkImportItemValidationDto],
    description: 'Detalle fila por fila analizada',
  })
  rows: BulkImportItemValidationDto[];
}

export class ExecuteBulkImportDto {
  @ApiProperty({
    type: [BulkImportItemValidationDto],
    description: 'Listado de artículos validados que se van a procesar e insertar',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkImportItemValidationDto)
  items: BulkImportItemValidationDto[];
}

export class BulkImportSummaryDto implements BulkImportSummary {
  @ApiProperty({ example: 20, description: 'Total de filas enviadas a procesar' })
  totalProcessed: number;

  @ApiProperty({ example: 20, description: 'Total de productos creados con éxito en el catálogo' })
  createdCount: number;

  @ApiProperty({ example: 0, description: 'Total de productos que fallaron al guardar' })
  failedCount: number;

  @ApiProperty({
    type: [Object],
    example: [],
    description: 'Detalle de registros que fallaron durante la persistencia',
  })
  errors: Array<{
    rowNumber?: number;
    name?: string;
    message: string;
  }>;
}
