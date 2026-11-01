import { ApiClient } from '@/lib/api-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface RecoverPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', data);
  },

  async register(data: RegisterDto): Promise<any> {
    return ApiClient.post('/auth/register', data);
  },

  async recoverPassword(data: RecoverPasswordDto): Promise<any> {
    return ApiClient.post('/auth/recover-password', data);
  },

  async resetPassword(data: ResetPasswordDto): Promise<any> {
    return ApiClient.post('/auth/reset-password', data);
  },
};

