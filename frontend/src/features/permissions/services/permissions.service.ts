import { ApiClient } from '@/lib/api-client';

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export const permissionsService = {
  async getAll(): Promise<Permission[]> {
    return ApiClient.get<Permission[]>('/permissions');
  },

  async addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    return ApiClient.post<void>(`/roles/${roleId}/permissions`, { permissionId });
  },

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    return ApiClient.delete<void>(`/roles/${roleId}/permissions/${permissionId}`);
  },

  async syncRolePermissions(roleId: string, toAdd: string[], toRemove: string[]): Promise<void> {
    await Promise.all([
      ...toAdd.map((id) => this.addPermissionToRole(roleId, id)),
      ...toRemove.map((id) => this.removePermissionFromRole(roleId, id)),
    ]);
  },
};

