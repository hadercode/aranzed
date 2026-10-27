import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';

export class UpdatePurchaseStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la compra',
    enum: PurchaseStatus,
    example: PurchaseStatus.COMPLETED,
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(PurchaseStatus, { message: 'El estado proporcionado no es válido' })
  status: PurchaseStatus;
}
