import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaymentTerm } from '@/sales/domain/enums/sale-payment-term.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';

export class FindSalesQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda (número, cliente, cédula/RIF, notas)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: SaleType,
    description: 'Filtrar por tipo (QUOTATION o DIRECT_SALE)',
  })
  @IsOptional()
  @IsEnum(SaleType)
  saleType?: SaleType;

  @ApiPropertyOptional({
    enum: SalePaymentTerm,
    description: 'Filtrar por término de pago (CONTADO o CREDITO)',
  })
  @IsOptional()
  @IsEnum(SalePaymentTerm)
  paymentTerm?: SalePaymentTerm;

  @ApiPropertyOptional({
    enum: SalePaidStatus,
    description: 'Filtrar por estado de pago (PENDIENTE, ABONADO, PAGADO)',
  })
  @IsOptional()
  @IsEnum(SalePaidStatus)
  paidStatus?: SalePaidStatus;

  @ApiPropertyOptional({ enum: SaleStatus, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiPropertyOptional({ description: 'Filtrar por nombre de cliente' })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({ description: 'Fecha inicial (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha final (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Límite de paginación', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Offset de paginación', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
