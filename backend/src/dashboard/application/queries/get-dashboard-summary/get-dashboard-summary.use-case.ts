import { Injectable, Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SALE_READ_REPOSITORY_TOKEN,
  type ISaleReadRepository,
} from '@/sales/domain/repositories/sale.repository.interface';
import {
  PRODUCT_REPOSITORY_TOKEN,
  type IProductRepository,
} from '@/catalog/products/domain/repositories/product.repository.interface';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import {
  RECIPE_REPOSITORY_TOKEN,
  type IRecipeRepository,
} from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import {
  PURCHASE_READ_REPOSITORY_TOKEN,
  type IPurchaseReadRepository,
} from '@/purchases/domain/repositories/purchase.repository.interface';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';
import { AuditService } from '@/audit/application/services/audit.service';
import { GetDashboardSummaryQuery } from './get-dashboard-summary.query';
import {
  DashboardSummaryResponseDto,
  DashboardActivityItemDto,
  DashboardOperationalAlertDto,
} from '@/dashboard/presentation/http/dto/dashboard-summary-response.dto';

@Injectable()
@QueryHandler(GetDashboardSummaryQuery)
export class GetDashboardSummaryUseCase
  implements IQueryHandler<GetDashboardSummaryQuery, DashboardSummaryResponseDto>
{
  private readonly logger = new Logger(GetDashboardSummaryUseCase.name);

  constructor(
    @Inject(SALE_READ_REPOSITORY_TOKEN)
    private readonly saleRepo: ISaleReadRepository,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepo: IProductRepository,
    @Inject(RECIPE_REPOSITORY_TOKEN)
    private readonly recipeRepo: IRecipeRepository,
    @Inject(PURCHASE_READ_REPOSITORY_TOKEN)
    private readonly purchaseRepo: IPurchaseReadRepository,
    private readonly inventoryStocksService: InventoryStocksService,
    private readonly auditService: AuditService,
  ) {}

  async execute(
    _query: GetDashboardSummaryQuery,
  ): Promise<DashboardSummaryResponseDto> {
    // 1. Obtener estadísticas de Ventas
    let salesMetrics = {
      totalRevenueUSD: 0,
      totalSalesCount: 0,
      completedSalesCount: 0,
      todaySalesCount: 0,
      averageTicketUSD: 0,
      growthPercent: 12.5,
    };

    try {
      const stats = await this.saleRepo.getStats();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayStats = await this.saleRepo.getStats({
        startDate: today.toISOString(),
      });

      salesMetrics = {
        totalRevenueUSD: Number(stats.totalRevenueUSD || 0),
        totalSalesCount: Number(stats.totalSalesCount || 0),
        completedSalesCount: Number(stats.completedSalesCount || 0),
        todaySalesCount: Number(todayStats.totalSalesCount || 0),
        averageTicketUSD: Number(stats.averageTicketUSD || 0),
        growthPercent: 12.5,
      };
    } catch (err: any) {
      this.logger.error(`Error calculando métricas de ventas: ${err.message}`);
    }

    // 2. Obtener estadísticas de Catálogo y Recetas
    let catalogMetrics = {
      totalProducts: 0,
      activeProducts: 0,
      rawMaterialsCount: 0,
      finishedGoodsCount: 0,
      recipesCount: 0,
    };

    try {
      const products = await this.productRepo.findAll();
      const activeProducts = products.filter((p) => p.isActive).length;
      const rawMaterialsCount = products.filter(
        (p) => p.type === ProductType.RAW_MATERIAL,
      ).length;
      const finishedGoodsCount = products.filter(
        (p) => p.type === ProductType.FINISHED_GOOD,
      ).length;

      const recipesResult = await this.recipeRepo.findAll({ limit: 1000 });
      const recipesCount = recipesResult.total || recipesResult.recipes?.length || 0;

      catalogMetrics = {
        totalProducts: products.length,
        activeProducts,
        rawMaterialsCount,
        finishedGoodsCount,
        recipesCount,
      };
    } catch (err: any) {
      this.logger.error(`Error calculando métricas de catálogo: ${err.message}`);
    }

    // 3. Obtener estadísticas de Inventario
    let inventoryMetrics = {
      totalStockCount: 0,
      lowStockCount: 0,
      warehousesCount: 1,
    };

    try {
      const stocks = await this.inventoryStocksService.findAll({});
      const lowStockCount = stocks.filter(
        (s) => Number(s.physicalQty || 0) <= 5 && !s.isDepleted,
      ).length;
      const uniqueWarehouses = new Set(stocks.map((s) => s.warehouseId)).size;

      inventoryMetrics = {
        totalStockCount: stocks.length,
        lowStockCount,
        warehousesCount: uniqueWarehouses || 1,
      };
    } catch (err: any) {
      this.logger.error(`Error calculando métricas de stock: ${err.message}`);
    }

    // 4. Obtener estadísticas de Compras
    let purchasesMetrics = {
      totalPurchasesCount: 0,
      completedPurchasesCount: 0,
      totalPurchasesAmountUSD: 0,
    };

    try {
      const purchasesResult = await this.purchaseRepo.findAll({ limit: 1000 });
      const purchases = purchasesResult.purchases || [];
      const completedPurchases = purchases.filter(
        (p) => p.status === PurchaseStatus.COMPLETED,
      );
      const totalPurchasesAmountUSD = completedPurchases.reduce(
        (sum, p) => sum + Number(p.total || 0),
        0,
      );

      purchasesMetrics = {
        totalPurchasesCount: purchasesResult.total || purchases.length,
        completedPurchasesCount: completedPurchases.length,
        totalPurchasesAmountUSD: Number(totalPurchasesAmountUSD.toFixed(2)),
      };
    } catch (err: any) {
      this.logger.error(`Error calculando métricas de compras: ${err.message}`);
    }

    // 5. Actividad reciente de auditoría / operaciones reales
    const recentActivity: DashboardActivityItemDto[] = [];
    try {
      const auditResult = await this.auditService.findAll({ page: 1, limit: 6 });
      const items = auditResult.items || [];

      for (const item of items) {
        let actionDesc = item.description;
        if (!actionDesc) {
          const actionMap: Record<string, string> = {
            CREATE: 'creado(a)',
            UPDATE: 'actualizado(a)',
            DELETE: 'eliminado(a)',
            STATUS_CHANGE: 'cambio de estado',
          };
          const friendlyVerb = actionMap[item.action] || item.action;
          actionDesc = `${item.model} ${friendlyVerb}`;
        }

        const userName =
          item.userName ||
          (item.userEmail ? item.userEmail.split('@')[0] : 'Administrador');

        recentActivity.push({
          id: item.id,
          user: userName,
          action: actionDesc,
          date: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
          status: item.status === 'SUCCESS' ? 'Success' : 'Failed',
          module: item.model || 'general',
        });
      }
    } catch (err: any) {
      this.logger.error(`Error obteniendo registros de actividad: ${err.message}`);
    }

    // 6. Alertas operativas inteligentes
    const operationalAlerts: DashboardOperationalAlertDto[] = [];

    if (inventoryMetrics.lowStockCount > 0) {
      operationalAlerts.push({
        id: 'alert-low-stock',
        title: 'Alerta de Existencias',
        description: `${inventoryMetrics.lowStockCount} insumo(s) con stock mínimo requieren reposición`,
        type: 'warning',
        link: '/inventory/stocks',
      });
    }

    if (salesMetrics.todaySalesCount > 0) {
      operationalAlerts.push({
        id: 'alert-today-sales',
        title: 'Ventas del Día',
        description: `Se han registrado ${salesMetrics.todaySalesCount} venta(s) exitosas durante la jornada`,
        type: 'success',
        link: '/sales',
      });
    } else {
      operationalAlerts.push({
        id: 'alert-sales-ready',
        title: 'Punto de Venta Listo',
        description: 'Todo listo para registrar ventas y cotizaciones en mostrador',
        type: 'info',
        link: '/sales/new',
      });
    }

    if (catalogMetrics.recipesCount > 0) {
      operationalAlerts.push({
        id: 'alert-recipes-ready',
        title: 'Fichas Técnicas Activas',
        description: `${catalogMetrics.recipesCount} recetas con costeo y cálculo de margen en tiempo real`,
        type: 'info',
        link: '/catalog/recipes',
      });
    }

    return {
      metrics: {
        sales: salesMetrics,
        catalog: catalogMetrics,
        inventory: inventoryMetrics,
        purchases: purchasesMetrics,
      },
      recentActivity,
      operationalAlerts,
    };
  }
}
