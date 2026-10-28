import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'Identificador único del registro de almacenamiento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Clave única (Key) del objeto en el bucket S3',
    example: 'products/17299000-abcd-zapato.png',
  })
  key: string;

  @ApiProperty({
    description: 'Nombre del bucket S3 en Neon donde se almacenó el archivo',
    example: 'uploads',
  })
  bucket: string;

  @ApiProperty({
    description: 'Carpeta o subdirectorio dentro del bucket',
    example: 'products',
  })
  folder: string;

  @ApiProperty({
    description: 'Nombre original del archivo subido',
    example: 'zapato.png',
  })
  originalName: string;

  @ApiProperty({
    description: 'Nombre generado para el archivo en el bucket',
    example: '17299000-abcd-zapato.png',
  })
  fileName: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'image/png',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 15420,
  })
  size: number;

  @ApiProperty({
    description: 'URL firmada temporal generada para visualización inmediata segura',
    example: 'https://...',
  })
  url: string;

  @ApiProperty({
    description: 'Fecha y hora de subida en formato ISO 8601',
    example: '2026-10-27T19:40:00.000Z',
  })
  createdAt: string;
}
