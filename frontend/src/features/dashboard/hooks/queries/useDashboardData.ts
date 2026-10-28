import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';
import type { MetricCardProps } from '../../components/MetricCard';
import type { ActivityLogItem } from '../../components/DashboardActivityTable';
import type { TeamUpdateItemProps } from '../../components/TeamUpdateItem';
import type { DashboardSummaryResponse } from '../../types';

export function useDashboardData() {
  const { data, isLoading, isFetching, error, refetch } = useQuery<DashboardSummaryResponse>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 1000 * 30, // 30 segundos
    refetchOnWindowFocus: true,
  });

  const metrics = useMemo<MetricCardProps[]>(() => {
    if (!data?.metrics) {
      return [
        {
          title: 'Ventas del Período',
          value: '$0.00',
          change: 'Cargando ventas...',
          trend: 'neutral',
          loading: isLoading,
        },
        {
          title: 'Productos en Catálogo',
          value: '0 activos',
          change: '0 insumos / materias primas',
          trend: 'neutral',
          loading: isLoading,
        },
        {
          title: 'Fichas Técnicas (BOM)',
          value: '0 recetas',
          change: 'Costeo en tiempo real',
          trend: 'neutral',
          loading: isLoading,
        },
        {
          title: 'Control de Stock',
          value: '0 registros',
          change: 'Sincronizando inventario...',
          trend: 'neutral',
          loading: isLoading,
        },
      ];
    }

    const { sales, catalog, inventory } = data.metrics;

    const formattedRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(sales.totalRevenueUSD || 0);

    const salesCard: MetricCardProps = {
      title: 'Ventas del Período',
      value: formattedRevenue,
      change: `${sales.completedSalesCount || 0} completadas (${sales.todaySalesCount || 0} hoy)`,
      trend: sales.totalRevenueUSD > 0 ? 'up' : 'neutral',
      loading: false,
    };

    const catalogCard: MetricCardProps = {
      title: 'Productos en Catálogo',
      value: `${catalog.activeProducts || 0} activos`,
      change: `${catalog.rawMaterialsCount || 0} insumos base`,
      trend: catalog.activeProducts > 0 ? 'up' : 'neutral',
      loading: false,
    };

    const recipesCard: MetricCardProps = {
      title: 'Fichas Técnicas (BOM)',
      value: `${catalog.recipesCount || 0} recetas`,
      change: `${catalog.finishedGoodsCount || 0} productos formulados`,
      trend: catalog.recipesCount > 0 ? 'up' : 'neutral',
      loading: false,
    };

    const inventoryCard: MetricCardProps = {
      title: 'Control de Stock',
      value: `${inventory.totalStockCount || 0} referencias`,
      change:
        inventory.lowStockCount > 0
          ? `${inventory.lowStockCount} bajo stock mínimo`
          : 'Existencias óptimas',
      trend: inventory.lowStockCount > 0 ? 'down' : 'up',
      loading: false,
    };

    return [salesCard, catalogCard, recipesCard, inventoryCard];
  }, [data, isLoading]);

  const recentLogs = useMemo<ActivityLogItem[]>(() => {
    if (!data?.recentActivity || data.recentActivity.length === 0) {
      return [];
    }

    return data.recentActivity.map((act) => {
      let formattedDate = act.date;
      try {
        const d = new Date(act.date);
        formattedDate = new Intl.DateTimeFormat('es-VE', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(d);
      } catch {
        // Fallback
      }

      return {
        user: act.user,
        action: act.action,
        date: formattedDate,
        status: act.status,
      };
    });
  }, [data]);

  const teamUpdates = useMemo<TeamUpdateItemProps[]>(() => {
    if (!data?.operationalAlerts || data.operationalAlerts.length === 0) {
      return [
        {
          name: 'Taller 100% Operativo',
          action: 'Catálogo, recetas y almacenes sincronizados',
          type: 'success',
        },
      ];
    }

    return data.operationalAlerts.map((alert) => ({
      name: alert.title,
      action: alert.description,
      type: alert.type,
    }));
  }, [data]);

  return {
    metrics,
    recentLogs,
    teamUpdates,
    rawSummary: data,
    loading: isLoading,
    isFetching,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refetch,
  };
}
