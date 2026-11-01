import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type UserProfile } from '../../services';
import { PROFILE_QUERY_KEY } from '../queries/useProfileQuery';
import { useAuthStore } from '@/shared/hooks/store/useAuthStore';

interface UseProfileMutationsOptions {
  onSuccess?: (updated: UserProfile) => void;
}

export function useProfileMutations(options?: UseProfileMutationsOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const updateUser = useAuthStore((state) => state.updateUser);

  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => profileService.updateProfile(data),
    onSuccess: (res) => {
      setSuccessMessage('Datos personales actualizados correctamente');
      updateUser(res.user);
      invalidateProfile();
      options?.onSuccess?.(res.user);
    },
    onError: (err: any) => setError(err.message || 'Error al actualizar perfil'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      profileService.changePassword(currentPassword, newPassword),
    onSuccess: (res) => {
      setSuccessMessage(res.message || 'Contraseña cambiada exitosamente');
    },
    onError: (err: any) => setError(err.message || 'Error al cambiar contraseña'),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => {
      setSuccessMessage('Foto de perfil actualizada con éxito en la nube');
      invalidateProfile();
    },
    onError: (err: any) => setError(err.message || 'Error al subir foto de perfil'),
  });

  const removeAvatarMutation = useMutation({
    mutationFn: () => {
      const currentUser = useAuthStore.getState().user;
      return profileService.removeAvatar(currentUser?.avatarUrl);
    },
    onSuccess: () => {
      setSuccessMessage('Foto de perfil eliminada');
      updateUser({ avatarUrl: null });
      invalidateProfile();
    },
    onError: (err: any) => setError(err.message || 'Error al eliminar foto de perfil'),
  });

  const isMutating =
    updateProfileMutation.isPending ||
    changePasswordMutation.isPending ||
    uploadAvatarMutation.isPending ||
    removeAvatarMutation.isPending;

  const updateProfile = async (data: Partial<UserProfile>) => {
    setError('');
    const res = await updateProfileMutation.mutateAsync(data);
    return res.user;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setError('');
    const res = await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
    return res.message;
  };

  const uploadAvatar = async (file: File) => {
    setError('');
    const res = await uploadAvatarMutation.mutateAsync(file);
    return res.url;
  };

  const removeAvatar = async () => {
    setError('');
    await removeAvatarMutation.mutateAsync();
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
