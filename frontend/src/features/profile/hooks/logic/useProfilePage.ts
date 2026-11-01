import { useState } from 'react';
import { useProfileQuery } from '../queries/useProfileQuery';
import { useProfileMutations } from '../mutations/useProfileMutations';
import { useProfileAvatar } from './useProfileAvatar';
import type { ProfileTab } from '../../components/ProfileHeroHeader';
import type {
  PersonalInfoFormData,
  ChangePasswordFormData,
} from '../../schemas/profile.schema';

export function useProfilePage() {
  const { data: profile, loading, error: fetchError, setData, refetch } = useProfileQuery();
  const {
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
    isMutating,
    error: mutationError,
    clearMessages,
  } = useProfileMutations({
    onSuccess: (updated) => setData(updated),
  });

  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const avatar = useProfileAvatar(profile, clearMessages);

  const handlePersonalSubmit = async (data: PersonalInfoFormData) => {
    try {
      await updateProfile(data);
      setSuccessMessage('Tus datos personales han sido actualizados exitosamente.');
      setIsSuccessOpen(true);
    } catch {
      // Handled in mutation hook
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccessMessage('Tu contraseña ha sido actualizada exitosamente.');
      setIsSuccessOpen(true);
    } catch {
      // Handled in mutation hook
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatar.selectedAvatarFile) return;
    try {
      await uploadAvatar(avatar.selectedAvatarFile);
      avatar.setSelectedAvatarFile(null);
      avatar.setFileError('');
      setSuccessMessage('Tu foto de perfil ha sido actualizada exitosamente.');
      setIsSuccessOpen(true);
    } catch {
      // Handled in mutation hook
    }
  };

  const handleConfirmRemoveAvatar = async () => {
    try {
      await removeAvatar();
      avatar.setSelectedAvatarFile(null);
      avatar.setAvatarPreview(null);
      avatar.closeConfirmRemove();
      setSuccessMessage('Tu foto de perfil ha sido eliminada exitosamente.');
      setIsSuccessOpen(true);
    } catch {
      // Handled in mutation hook
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  };

  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()
      : profile?.email?.split('@')[0] || 'Usuario';

  const userInitial = (
    profile?.firstName?.[0] ||
    profile?.email?.[0] ||
    'U'
  ).toUpperCase();

  const formattedJoinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recientemente';

  return {
    profile,
    loading,
    fetchError,
    mutationError,
    fileError: avatar.fileError,
    isMutating,
    activeTab,
    setActiveTab,
    selectedAvatarFile: avatar.selectedAvatarFile,
    avatarPreview: avatar.avatarPreview,
    isDragOver: avatar.isDragOver,
    fileInputRef: avatar.fileInputRef,
    handleDragOver: avatar.handleDragOver,
    handleDragLeave: avatar.handleDragLeave,
    handleDrop: avatar.handleDrop,
    handleFileInputChange: avatar.handleFileInputChange,
    handleSaveAvatar,
    handleCancelAvatarSelection: avatar.handleCancelAvatarSelection,
    openConfirmRemove: avatar.openConfirmRemove,
    closeConfirmRemove: avatar.closeConfirmRemove,
    isConfirmRemoveOpen: avatar.isConfirmRemoveOpen,
    handleConfirmRemoveAvatar,
    isSuccessOpen,
    successMessage,
    closeSuccess,
    handlePersonalSubmit,
    handlePasswordSubmit,
    fullName,
    userInitial,
    formattedJoinDate,
    refetch,
    clearMessages,
  };
}
