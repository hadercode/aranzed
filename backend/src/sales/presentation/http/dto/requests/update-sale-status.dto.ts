import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';

export class UpdateSaleStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del documento de venta',
    enum: SaleStatus,
    example: SaleStatus.COMPLETED,
  })
  @IsEnum(SaleStatus, {
    message: 'El estado debe ser DRAFT, PENDING, COMPLETED o CANCELLED',
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  status: SaleStatus;

  @ApiPropertyOptional({
    description:
      'Motivo de anulación o cancelación (requerido si pasa a CANCELLED)',
    example: 'Cancelación solicitada por el cliente antes del despacho',
  })
  @IsOptional()
  @IsString()
  cancelReason?: string;
}
