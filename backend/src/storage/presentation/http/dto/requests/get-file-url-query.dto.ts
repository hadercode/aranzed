import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetFileUrlQueryDto {
  @ApiProperty({
    description: 'Ruta/clave (Key) del archivo en el bucket S3',
    example: 'products/17299000-abcd-zapato.png',
  })
  @IsNotEmpty({ message: 'La clave (key) del archivo es requerida' })
  @IsString()
  key: string;

  @ApiPropertyOptional({
    description: 'Tiempo de validez de la URL firmada en segundos (por defecto 3600 segundos = 1 hora)',
    default: 3600,
    example: 3600,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(60, { message: 'El tiempo de expiración mínimo es de 60 segundos' })
  @Max(604800, { message: 'El tiempo de expiración máximo es de 7 días (604800 segundos)' })
  expiresIn?: number = 3600;
}
