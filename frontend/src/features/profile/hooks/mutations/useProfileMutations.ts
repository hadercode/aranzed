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
      // 1. Subir archivo a Neon S3 mediante /storage/upload indicando la carpeta "users"
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'users');
      formData.append('type', 'users');

      const storageRes = await ApiClient.post<{
        id: string;
        key: string;
        bucket: string;
        folder: string;
        originalName: string;
        fileName: string;
        mimeType: string;
        size: number;
        url: string;
        createdAt: string;
      }>('/storage/upload', formData);

      // Endpoint seguro que genera URLs firmadas bajo demanda para visualización
      const avatarUrl = `/storage/view?key=${encodeURIComponent(storageRes.key)}`;

      // 2. Persistir el nuevo avatar en el perfil del usuario
      const res = await ApiClient.put<{ message: string; user: UserProfile }>('/profile', {
        avatarUrl,
      });

      setSuccessMessage('Foto de perfil actualizada con éxito en la nube');
      const updatedUser = res.user || { avatarUrl };
      updateUser(updatedUser);
      if (options?.onSuccess && res.user) {
        options.onSuccess(res.user);
      }

      return storageRes.url || avatarUrl;
    });
  };

  const removeAvatar = async (): Promise<void> => {
    return execute(async () => {
      // Si el avatar actual estaba en S3, eliminarlo del bucket de storage
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.avatarUrl?.includes('key=')) {
        try {
          const match = currentUser.avatarUrl.match(/key=([^&]+)/);
          if (match && match[1]) {
            const key = decodeURIComponent(match[1]);
            await ApiClient.delete(`/storage?key=${encodeURIComponent(key)}`);
          }
        } catch {
          // Continuar aunque falle el borrado del storage
        }
      }

      const res = await ApiClient.put<{ message: string; user: UserProfile }>('/profile', {
        avatarUrl: null,
      });
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
