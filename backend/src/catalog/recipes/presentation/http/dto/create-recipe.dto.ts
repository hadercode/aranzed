import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
  IsEnum,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import { CreateRecipeItemDto } from './recipe-item.dto';

export class CreateRecipeDto {
  @ApiPropertyOptional({
    description: 'Código de la receta / BOM (autogenerado si se omite)',
    example: 'BOM-0001',
  })
  @IsOptional()
  @IsString({ message: 'El código debe ser texto' })
  @MaxLength(30, { message: 'El código no puede superar los 30 caracteres' })
  code?: string;

  @ApiProperty({
    description: 'Nombre de la receta o fórmula de ensamblaje',
    example: 'Receta Estándar - Escritorio Modular Roble',
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de la receta es obligatorio' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  name: string;

  @ApiProperty({
    description: 'UUID del producto terminado fabricado por esta receta',
    example: 'f2d4e789-9c0b-4ef8-bb6d-6bb9bd380a22',
  })
  @IsUUID('4', {
    message: 'El ID del producto terminado debe ser un UUID válido',
  })
  productId: string;

  @ApiPropertyOptional({
    description: 'Estado de la receta',
    enum: RecipeStatus,
    default: RecipeStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(RecipeStatus, { message: 'El estado de la receta no es válido' })
  status?: RecipeStatus;

  @ApiPropertyOptional({
    description: 'Cantidad de unidades que produce esta receta (rendimiento)',
    example: 1.0,
    default: 1.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El rendimiento debe ser un número' })
  @Min(0.0001, { message: 'El rendimiento debe ser mayor a 0' })
  yieldQuantity?: number;

  @ApiPropertyOptional({
    description: 'Descripción técnica o instrucciones del procedimiento',
    example: 'Ensamble de madera tratada con herrajes telescópicos.',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de componentes, materias primas y servicios',
    type: [CreateRecipeItemDto],
  })
  @IsOptional()
  @IsArray({ message: 'Los items deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  items?: CreateRecipeItemDto[];

  @ApiPropertyOptional({
    description:
      'Si es true y la receta es ACTIVE, actualiza automáticamente el costo del producto terminado',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  syncProductCost?: boolean;
}
