import { useMutation } from '@tanstack/react-query';
import {
  authService,
  type LoginDto,
  type RegisterDto,
  type RecoverPasswordDto,
  type ResetPasswordDto,
  type AuthResponse,
} from '../../services';

export function useAuthMutations() {
  const loginMutation = useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
  });

  const registerMutation = useMutation<any, Error, RegisterDto>({
    mutationFn: (dto) => authService.register(dto),
  });

  const recoverPasswordMutation = useMutation<any, Error, RecoverPasswordDto>({
    mutationFn: (dto) => authService.recoverPassword(dto),
  });

  const resetPasswordMutation = useMutation<any, Error, ResetPasswordDto>({
    mutationFn: (dto) => authService.resetPassword(dto),
  });

  return {
    loginMutation,
    registerMutation,
    recoverPasswordMutation,
    resetPasswordMutation,
  };
}

