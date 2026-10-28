import { ApiProperty } from '@nestjs/swagger';

export class SalesMetricsDto {
  @ApiProperty({ example: 4280.0 })
  totalRevenueUSD: number;

  @ApiProperty({ example: 125 })
  totalSalesCount: number;

  @ApiProperty({ example: 98 })
  completedSalesCount: number;

  @ApiProperty({ example: 12 })
  todaySalesCount: number;

  @ApiProperty({ example: 43.67 })
  averageTicketUSD: number;

  @ApiProperty({ example: 14.2 })
  growthPercent: number;
}

export class CatalogMetricsDto {
  @ApiProperty({ example: 48 })
  totalProducts: number;

  @ApiProperty({ example: 42 })
  activeProducts: number;

  @ApiProperty({ example: 18 })
  rawMaterialsCount: number;

  @ApiProperty({ example: 24 })
  finishedGoodsCount: number;

  @ApiProperty({ example: 16 })
  recipesCount: number;
}

export class InventoryMetricsDto {
  @ApiProperty({ example: 120 })
  totalStockCount: number;

  @ApiProperty({ example: 3 })
  lowStockCount: number;

  @ApiProperty({ example: 2 })
  warehousesCount: number;
}

export class PurchasesMetricsDto {
  @ApiProperty({ example: 34 })
  totalPurchasesCount: number;

  @ApiProperty({ example: 30 })
  completedPurchasesCount: number;

  @ApiProperty({ example: 2150.5 })
  totalPurchasesAmountUSD: number;
}

export class DashboardMetricsDto {
  @ApiProperty({ type: SalesMetricsDto })
  sales: SalesMetricsDto;

  @ApiProperty({ type: CatalogMetricsDto })
  catalog: CatalogMetricsDto;

  @ApiProperty({ type: InventoryMetricsDto })
  inventory: InventoryMetricsDto;

  @ApiProperty({ type: PurchasesMetricsDto })
  purchases: PurchasesMetricsDto;
}

export class DashboardActivityItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Administrador Aranzed' })
  user: string;

  @ApiProperty({ example: 'Venta #VENTA-0042 confirmada' })
  action: string;

  @ApiProperty({ example: 'CREATE', enum: ['CREATE', 'UPDATE'] })
  operationType: 'CREATE' | 'UPDATE';

  @ApiProperty({ example: '2026-10-28T14:30:00.000Z' })
  date: string;

  @ApiProperty({ example: 'Success', enum: ['Success', 'Failed', 'Pending'] })
  status: 'Success' | 'Failed' | 'Pending';

  @ApiProperty({ example: 'sales' })
  module: string;
}

export class DashboardOperationalAlertDto {
  @ApiProperty({ example: 'alert-1' })
  id: string;

  @ApiProperty({ example: 'Alerta de Existencias' })
  title: string;

  @ApiProperty({ example: '3 insumo(s) con stock mínimo requieren reposición' })
  description: string;

  @ApiProperty({ example: 'warning', enum: ['warning', 'info', 'success'] })
  type: 'warning' | 'info' | 'success';

  @ApiProperty({ example: '/inventory/stocks', required: false })
  link?: string;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ type: DashboardMetricsDto })
  metrics: DashboardMetricsDto;

  @ApiProperty({ type: [DashboardActivityItemDto] })
  recentActivity: DashboardActivityItemDto[];

  @ApiProperty({ type: [DashboardOperationalAlertDto] })
  operationalAlerts: DashboardOperationalAlertDto[];
}
