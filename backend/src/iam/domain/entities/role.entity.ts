import { BaseEntity } from '../../../core/domain/base.entity';
import { Permission } from './permission.entity';

export class Role extends BaseEntity {
  name: string;
  description: string;
  permissions: Permission[];

  constructor(
    id: string,
    name: string,
    description: string,
    permissions: Permission[] = [],
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.permissions = permissions;
  }

  assignPermission(permission: Permission) {
    if (!this.permissions.find((p) => p.id === permission.id)) {
      this.permissions.push(permission);
    }
  }

  revokePermission(permissionId: string) {
    this.permissions = this.permissions.filter((p) => p.id !== permissionId);
  }
}
