import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelSalePaymentDto {
  @ApiPropertyOptional({
    description: 'Motivo de anulación del cobro',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
