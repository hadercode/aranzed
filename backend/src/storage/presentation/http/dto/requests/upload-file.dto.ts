import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    description:
      'Carpeta o subdirectorio de destino dentro del bucket (ej: products, company, invoices, avatars)',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiPropertyOptional({
    description: 'Alias opcional de folder para indicar el tipo/categoría de destino',
    example: 'products',
  })
  @IsOptional()
  @IsString()
  type?: string;
}
