import { useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/shared/hooks/store/useAuthStore';
import type { UserProfile } from '../queries/useProfileQuery';

interface UseProfileMutationsOptions {
  onSuccess?: (updated: UserProfile) => void;
}

export function useProfileMutations(options?: UseProfileMutationsOptions) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const updateUser = useAuthStore((state) => state.updateUser);

  const execute = async <T>(action: () => Promise<T>): Promise<T> => {
    setIsMutating(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await action();
      return res;
    } catch (err: any) {
      setError(err || 'Error en la operación');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return execute(async () => {
      const res = await ApiClient.put<{ message: string; user: UserProfile }>('/profile', data);
      const updatedUser = res.user;
      setSuccessMessage('Datos personales actualizados correctamente');
      updateUser(updatedUser);
      if (options?.onSuccess) {
        options.onSuccess(updatedUser);
      }
      return updatedUser;
    });
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<string> => {
    return execute(async () => {
      const res = await ApiClient.put<{ message: string }>('/profile/password', {
        currentPassword,
        newPassword,
      });
      setSuccessMessage(res.message || 'Contraseña cambiada exitosamente');
      return res.message;
    });
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    return execute(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await ApiClient.post<{ message: string; avatarUrl: string; user: UserProfile }>(
        '/profile/avatar',
        formData,
      );
      setSuccessMessage('Foto de perfil actualizada con éxito');
      if (res.user) {
        updateUser(res.user);
        if (options?.onSuccess) {
          options.onSuccess(res.user);
        }
      } else {
        updateUser({ avatarUrl: res.avatarUrl });
      }
      return res.avatarUrl;
    });
  };

  const removeAvatar = async (): Promise<void> => {
    return execute(async () => {
      const res = await ApiClient.delete<{ message: string; avatarUrl: null; user: UserProfile }>(
        '/profile/avatar',
      );
      setSuccessMessage('Foto de perfil eliminada');
      if (res.user) {
        updateUser(res.user);
        if (options?.onSuccess) {
          options.onSuccess(res.user);
        }
      } else {
        updateUser({ avatarUrl: null });
      }
    });
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  return {
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
    isMutating,
    error,
    successMessage,
    clearMessages,
  };
}
