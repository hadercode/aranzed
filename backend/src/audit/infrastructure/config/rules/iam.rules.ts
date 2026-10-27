import { AuditRule } from '../audit-rule.types';
import { UserOrmEntity } from '../../../../iam/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../../../../iam/infrastructure/persistence/typeorm/entities/role.orm-entity';

export const iamAuditRules: AuditRule[] = [
  // --- Perfil de Usuario ---
  {
    path: '/profile/password',
    method: 'PUT',
    model: 'Perfil',
    action: 'CHANGE_PASSWORD',
    description: 'Cambio de contraseña del usuario',
    entity: {
      target: UserOrmEntity,
      resolveId: (req) => req.user?.userId || null,
    },
  },
  {
    path: '/profile/avatar',
    model: 'Perfil',
    action: (_req, method) =>
      method === 'DELETE' ? 'DELETE_AVATAR' : 'UPLOAD_AVATAR',
    description: (_req, method) =>
      method === 'DELETE'
        ? 'Eliminación de foto de perfil'
        : 'Subida de nueva foto de perfil',
    entity: {
      target: UserOrmEntity,
      resolveId: (req) => req.user?.userId || null,
    },
  },
  {
    path: '/profile',
    model: 'Perfil',
    action: (_req, method) => (method === 'PUT' ? 'UPDATE' : method),
    description: 'Actualización de datos del perfil de usuario',
    entity: {
      target: UserOrmEntity,
      relations: { roles: true },
      resolveId: (req) => req.user?.userId || null,
    },
  },

  // --- Usuarios ---
  {
    path: '/users',
    model: 'Usuario',
    description: (req, method, entityId) => {
      if (method === 'POST')
        return `Creación de usuario: ${req.body?.email || ''}`;
      if (method === 'PUT')
        return `Actualización de usuario (ID: ${entityId || ''})`;
      if (method === 'DELETE')
        return `Eliminación de usuario (ID: ${entityId || ''})`;
      return `Operación ${method} en Usuario`;
    },
    entity: {
      target: UserOrmEntity,
      relations: { roles: true },
    },
  },

  // --- Roles & Permisos ---
  {
    path: '/roles',
    model: 'Rol',
    action: (req, method) => {
      const url = req.originalUrl || req.url || '';
      if (url.includes('/permissions')) {
        return method === 'POST' ? 'ASSIGN_PERMISSION' : 'REVOKE_PERMISSION';
      }
      return method === 'POST'
        ? 'CREATE'
        : method === 'PUT'
          ? 'UPDATE'
          : method === 'DELETE'
            ? 'DELETE'
            : method;
    },
    description: (req, method, entityId) => {
      const url = req.originalUrl || req.url || '';
      if (url.includes('/permissions')) {
        return method === 'POST'
          ? `Asignación de permisos al rol (ID: ${entityId})`
          : `Revocación de permisos del rol (ID: ${entityId})`;
      }
      if (method === 'POST') return `Creación de rol: ${req.body?.name || ''}`;
      if (method === 'PUT')
        return `Actualización de rol (ID: ${entityId || ''})`;
      if (method === 'DELETE')
        return `Eliminación de rol (ID: ${entityId || ''})`;
      return `Operación ${method} en Rol`;
    },
    entity: {
      target: RoleOrmEntity,
      relations: { permissions: true },
    },
  },

  // --- Permisos Directos ---
  {
    path: '/permissions',
    model: 'Permisos',
    action: (_req, method) => method,
    description: (_req, method) => `Operación ${method} en Permisos`,
  },
];
