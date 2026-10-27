import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryReasonType } from '@/inventory/reasons/domain/enums/inventory-reason-type.enum';

export class CreateInventoryReasonDto {
  @ApiProperty({ description: 'Nombre del motivo', example: 'Merma por Daño' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Tipo de movimiento aplicable',
    enum: InventoryReasonType,
    example: InventoryReasonType.OUTPUT,
  })
  @IsEnum(InventoryReasonType)
  @IsNotEmpty()
  type: InventoryReasonType;

  @ApiPropertyOptional({ description: 'Descripción detallada del motivo' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
