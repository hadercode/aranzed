import { ApiProperty } from '@nestjs/swagger';

export class SaleStatsResponseDto {
  @ApiProperty()
  totalSalesCount: number;

  @ApiProperty()
  totalQuotationsCount: number;

  @ApiProperty()
  completedSalesCount: number;

  @ApiProperty()
  draftCount: number;

  @ApiProperty()
  cancelledCount: number;

  @ApiProperty()
  totalRevenueUSD: number;

  @ApiProperty()
  totalRevenueLocal: number;

  @ApiProperty()
  averageTicketUSD: number;
}
