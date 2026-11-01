import { useState, useEffect, useRef } from 'react';
import { getAssetUrl } from '@/lib/api-client';
import type { UserProfile } from '../queries/useProfileQuery';

export function useProfileAvatar(
  profile: UserProfile | null,
  onClearMessages: () => void
) {
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.avatarUrl) {
        setAvatarPreview(getAssetUrl(profile.avatarUrl));
      } else {
        setAvatarPreview(null);
      }
    }
  }, [profile]);

  const handleFileSelect = (file: File) => {
    setFileError('');
    if (!file.type.match(/^image\/(jpeg|png|webp|gif|jpg)$/)) {
      setFileError('Solo se admiten formatos de imagen JPG, PNG, WEBP o GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('El tamaño del archivo no puede exceder 5 MB.');
      return;
    }
    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    onClearMessages();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCancelAvatarSelection = () => {
    setSelectedAvatarFile(null);
    setFileError('');
    setAvatarPreview(profile?.avatarUrl ? getAssetUrl(profile.avatarUrl) : null);
  };

  const openConfirmRemove = () => setIsConfirmRemoveOpen(true);
  const closeConfirmRemove = () => setIsConfirmRemoveOpen(false);

  return {
    selectedAvatarFile,
    setSelectedAvatarFile,
    avatarPreview,
    setAvatarPreview,
    isDragOver,
    fileError,
    setFileError,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleCancelAvatarSelection,
    isConfirmRemoveOpen,
    openConfirmRemove,
    closeConfirmRemove,
  };
}

