import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRecipeItemDto {
  @ApiProperty({
    description:
      'UUID del producto insumo, materia prima o servicio componente',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', {
    message: 'El ID del producto componente debe ser un UUID válido',
  })
  productId: string;

  @ApiProperty({
    description: 'Cantidad a utilizar en la receta',
    example: 1.5,
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0.0001, { message: 'La cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({
    description: 'Costo unitario del componente',
    example: 45.0,
  })
  @IsNumber({}, { message: 'El costo unitario debe ser un número' })
  @Min(0, { message: 'El costo unitario no puede ser negativo' })
  unitCost: number;

  @ApiPropertyOptional({
    description: 'Notas o instrucciones de uso del componente',
    example: 'Aplicar durante la fase de lijado',
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(255, { message: 'Las notas no pueden superar los 255 caracteres' })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Orden de visualización / preparación',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
