import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUomDto {
  @ApiPropertyOptional({
    description: 'Código único de la unidad de medida',
    example: 'KG',
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional({
    description: 'Nombre descriptivo de la unidad de medida',
    example: 'Kilogramo',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    description: 'Indica si la unidad de medida está activa',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si permite cantidades decimales',
  })
  @IsBoolean()
  @IsOptional()
  allowDecimals?: boolean;
}
