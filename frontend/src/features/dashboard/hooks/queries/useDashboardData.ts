import { useState } from 'react';
import type { MetricCardProps } from '../../components/MetricCard';
import type { ActivityLogItem } from '../../components/DashboardActivityTable';
import type { TeamUpdateItemProps } from '../../components/TeamUpdateItem';

export function useDashboardData() {
  const [metrics] = useState<MetricCardProps[]>([
    {
      title: 'Ventas del Período',
      value: '$4,280.00',
      change: '+14.2% vs mes anterior',
      trend: 'up',
    },
    {
      title: 'Productos en Catálogo',
      value: '48 activos',
      change: '8 materias primas',
      trend: 'up',
    },
    {
      title: 'Fichas Técnicas (BOM)',
      value: '16 recetas',
      change: 'Costeo en tiempo real',
      trend: 'neutral',
    },
  ]);

  const [recentLogs] = useState<ActivityLogItem[]>([
    {
      user: 'Administrador Aranzed',
      action: 'Venta #VENTA-0042 confirmada',
      date: 'Hoy, 11:20 AM',
      status: 'Success',
    },
    {
      user: 'Taller de Diseños',
      action: 'Receta "Box San Valentín" actualizada',
      date: 'Hoy, 09:45 AM',
      status: 'Success',
    },
    {
      user: 'Almacén Central',
      action: 'Entrada de compra #CMP-0018 registrada',
      date: 'Ayer, 04:30 PM',
      status: 'Success',
    },
    {
      user: 'Control de Stock',
      action: 'Ajuste de inventario físico completado',
      date: 'Ayer, 02:15 PM',
      status: 'Success',
    },
  ]);

  const [teamUpdates] = useState<TeamUpdateItemProps[]>([
    { name: 'Aranzed Taller', action: 'Producción de 12 arreglos en curso' },
    { name: 'Compras & Proveedores', action: 'Factura de rosas ecuatorianas recibida' },
    { name: 'Caja Principal', action: 'Cierre de cobros en punto de venta OK' },
  ]);

  return {
    metrics,
    recentLogs,
    teamUpdates,
  };
}
