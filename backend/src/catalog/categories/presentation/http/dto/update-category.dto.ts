import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la categoría',
    example: 'Electrónica y Más',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría padre opcional',
    example: 'd3b07384-d113-4045-a126-773df0c3c6f2',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string | null;

  @ApiPropertyOptional({ description: 'Indica si la categoría está activa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
