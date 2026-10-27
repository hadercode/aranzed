import { Permission } from '../entities/permission.entity';

export interface IPermissionRepository {
  save(permission: Permission): Promise<void>;
  findById(id: string): Promise<Permission | null>;
  findByActionAndResource(
    action: string,
    resource: string,
  ): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
}
