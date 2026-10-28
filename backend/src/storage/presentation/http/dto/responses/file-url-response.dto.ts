import { ApiProperty } from '@nestjs/swagger';

export class FileUrlResponseDto {
  @ApiProperty({
    description: 'Clave única (Key) del archivo en el bucket S3',
    example: 'products/17299000-abcd-zapato.png',
  })
  key: string;

  @ApiProperty({
    description: 'URL firmada temporal generada con S3 Presigner para acceso seguro',
    example: 'https://...',
  })
  url: string;

  @ApiProperty({
    description: 'Tiempo de vida de la URL firmada en segundos',
    example: 3600,
  })
  expiresIn: number;
}
