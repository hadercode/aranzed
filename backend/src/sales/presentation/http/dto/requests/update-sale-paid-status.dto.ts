import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

export class UpdateSalePaidStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de pago de la venta',
    enum: SalePaidStatus,
    example: SalePaidStatus.PAGADO,
  })
  @IsEnum(SalePaidStatus, {
    message: 'El estado de pago debe ser PENDIENTE, ABONADO o PAGADO',
  })
  @IsNotEmpty({ message: 'El estado de pago es obligatorio' })
  paidStatus: SalePaidStatus;
}
