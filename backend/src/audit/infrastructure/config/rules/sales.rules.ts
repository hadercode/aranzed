import { AuditRule } from '../audit-rule.types';
import { SaleOrmEntity } from '../../../../sales/infrastructure/persistence/typeorm/entities/sale.orm-entity';

export const salesAuditRules: AuditRule[] = [
  {
    path: '/sales',
    model: 'Ventas',
    action: (req, method) => {
      if (req.url?.includes('/convert')) return 'CONVERT';
      if (req.url?.includes('/status')) return 'STATUS_CHANGE';
      if (method === 'POST') return 'CREATE';
      if (method === 'PUT') return 'UPDATE';
      if (method === 'PATCH') return 'UPDATE';
      if (method === 'DELETE') return 'DELETE';
      return method;
    },
    description: (req, method) => {
      if (req.url?.includes('/convert'))
        return 'Conversión de cotización a venta directa';
      if (req.url?.includes('/status'))
        return 'Cambio de estado en documento de venta';
      if (method === 'POST') return 'Registro de nueva venta o cotización';
      if (method === 'PUT' || method === 'PATCH')
        return 'Actualización de venta o cotización';
      if (method === 'DELETE') return 'Eliminación de documento de venta';
      return `${method} en Ventas`;
    },
    entity: {
      target: SaleOrmEntity,
      resolveId: (req) => req.params?.id || null,
    },
  },
];
