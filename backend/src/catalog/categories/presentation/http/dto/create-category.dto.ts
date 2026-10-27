import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría padre opcional',
    example: 'd3b07384-d113-4045-a126-773df0c3c6f2',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Indica si la categoría está activa',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
