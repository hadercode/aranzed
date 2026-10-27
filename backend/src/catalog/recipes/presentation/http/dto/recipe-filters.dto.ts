import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';

export class RecipeFiltersDto {
  @ApiPropertyOptional({
    description:
      'Buscar por código, nombre de receta o nombre de producto terminado',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por UUID de producto terminado',
  })
  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de la receta',
    enum: RecipeStatus,
  })
  @IsOptional()
  @IsEnum(RecipeStatus)
  status?: RecipeStatus;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados a retornar',
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento para paginación',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
