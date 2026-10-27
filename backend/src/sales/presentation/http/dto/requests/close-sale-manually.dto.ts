import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class CloseSaleManuallyDto {
  @ApiPropertyOptional({
    description: 'Diferencia a condonar o ajustar para saldar la venta',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  differenceAdjustment?: number;

  @ApiPropertyOptional({
    description:
      'Motivo o justificación del cierre manual (ej: ajuste de centavos)',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
