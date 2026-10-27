import { AuditRule } from '../audit-rule.types';
import { CompanyOrmEntity } from '../../../../company/infrastructure/persistence/typeorm/entities/company.orm-entity';

export const companyAuditRules: AuditRule[] = [
  {
    path: '/company/logo',
    method: 'POST',
    model: 'Empresa',
    action: 'UPLOAD_LOGO',
    description: 'Actualización del logo corporativo de la empresa',
    entity: {
      target: CompanyOrmEntity,
      isSingleton: true,
    },
  },
  {
    path: '/company',
    model: 'Empresa',
    action: (_req, method) => (method === 'PUT' ? 'UPDATE' : method),
    description: 'Actualización de la configuración de la empresa',
    entity: {
      target: CompanyOrmEntity,
      isSingleton: true,
    },
  },
];
