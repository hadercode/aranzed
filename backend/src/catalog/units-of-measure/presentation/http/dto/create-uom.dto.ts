import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUomDto {
  @ApiProperty({
    description: 'Código único de la unidad de medida',
    example: 'KG',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo de la unidad de medida',
    example: 'Kilogramo',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'Indica si la unidad de medida está activa',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Indica si permite cantidades decimales',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  allowDecimals?: boolean;
}
