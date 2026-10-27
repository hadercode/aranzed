import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockReservationDto {
  @ApiProperty({ description: 'ID del registro de stock específico' })
  @IsString()
  @IsNotEmpty()
  stockId: string;

  @ApiProperty({
    description: 'Tipo de documento comercial',
    example: 'SALES_ORDER',
  })
  @IsString()
  @IsNotEmpty()
  referenceType: string;

  @ApiProperty({ description: 'ID de la cabecera del documento comercial' })
  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @ApiPropertyOptional({ description: 'ID del ítem o renglón específico' })
  @IsString()
  @IsOptional()
  referenceItemId?: string;

  @ApiProperty({
    description: 'Cantidad a reservar en UoM principal',
    example: 10,
  })
  @IsNumber()
  @Min(0.00001)
  reservedQty: number;

  @ApiPropertyOptional({ description: 'Cantidad a reservar en UoM secundaria' })
  @IsNumber()
  @IsOptional()
  secReservedQty?: number;
}
