import { ApiClient } from '@/lib/api-client';
import type { User } from '../types/user';

export interface CreateUserData {
  email: string;
  password?: string;
  roles?: string[];
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  roles?: string[];
}

export const path = '/users';

export const usersService = {
  async getAll(): Promise<User[]> {
    return ApiClient.get<User[]>(path);
  },

  async getById(id: string): Promise<User> {
    return ApiClient.get<User>(`${path}/${id}`);
  },

  async create(data: CreateUserData): Promise<User> {
    return ApiClient.post<User>(path, data);
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    return ApiClient.put<User>(`${path}/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return ApiClient.delete<void>(`${path}/${id}`);
  },
};

