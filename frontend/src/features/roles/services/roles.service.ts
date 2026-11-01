import { ApiClient } from '@/lib/api-client';

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: Permission[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  name: string;
  description: string;
}

const path = '/roles';

export const rolesService = {
  async getAll(): Promise<Role[]> {
    return ApiClient.get<Role[]>(path);
  },

  async getById(id: string): Promise<Role> {
    return ApiClient.get<Role>(`${path}/${id}`);
  },

  async create(data: CreateRoleDto): Promise<Role> {
    return ApiClient.post<Role>(path, data);
  },

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    return ApiClient.put<Role>(`${path}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`${path}/${id}`);
  },
};

