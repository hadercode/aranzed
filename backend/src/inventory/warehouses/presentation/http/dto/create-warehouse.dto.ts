import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WarehouseResponsibleDto {
  @ApiProperty({ description: 'ID del usuario responsable' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Si es el responsable principal',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Código único del almacén', example: 'ALM-01' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo del almacén',
    example: 'Almacén Central',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Ubicación física del almacén' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Estado activo del almacén',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Si es el almacén principal para ventas (POS)',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSalesWarehouse?: boolean;

  @ApiPropertyOptional({
    description: 'Lista de usuarios responsables',
    type: [WarehouseResponsibleDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WarehouseResponsibleDto)
  responsibles?: WarehouseResponsibleDto[];
}
