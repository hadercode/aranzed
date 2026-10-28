export interface SalesMetrics {
  totalRevenueUSD: number;
  totalSalesCount: number;
  completedSalesCount: number;
  todaySalesCount: number;
  averageTicketUSD: number;
  growthPercent: number;
}

export interface CatalogMetrics {
  totalProducts: number;
  activeProducts: number;
  rawMaterialsCount: number;
  finishedGoodsCount: number;
  recipesCount: number;
}

export interface InventoryMetrics {
  totalStockCount: number;
  lowStockCount: number;
  warehousesCount: number;
}

export interface PurchasesMetrics {
  totalPurchasesCount: number;
  completedPurchasesCount: number;
  totalPurchasesAmountUSD: number;
}

export interface DashboardMetrics {
  sales: SalesMetrics;
  catalog: CatalogMetrics;
  inventory: InventoryMetrics;
  purchases: PurchasesMetrics;
}

export interface DashboardActivityItem {
  id: string;
  user: string;
  action: string;
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
  module: string;
}

export interface DashboardOperationalAlert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  link?: string;
}

export interface DashboardSummaryResponse {
  metrics: DashboardMetrics;
  recentActivity: DashboardActivityItem[];
  operationalAlerts: DashboardOperationalAlert[];
}
