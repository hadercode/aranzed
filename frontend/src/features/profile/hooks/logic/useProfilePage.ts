import { useState, useEffect, useRef } from "react";
import { useProfileQuery } from "../queries/useProfileQuery";
import { useProfileMutations } from "../mutations/useProfileMutations";
import { getAssetUrl } from "@/lib/api-client";
import type { ProfileTab } from "../../components/ProfileHeroHeader";
import type {
  PersonalInfoFormData,
  ChangePasswordFormData,
} from "../../schemas/profile.schema";

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

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  // Avatar states
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dialog states
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync avatarPreview with profile
  useEffect(() => {
    if (profile) {
      if (profile.avatarUrl) {
        setAvatarPreview(getAssetUrl(profile.avatarUrl));
      } else {
        setAvatarPreview(null);
      }
    }
  }, [profile]);

  // File handlers
  const handleFileSelect = (file: File) => {
    setFileError("");
    if (!file.type.match(/^image\/(jpeg|png|webp|gif|jpg)$/)) {
      setFileError("Solo se admiten formatos de imagen JPG, PNG, WEBP o GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("El tamaño del archivo no puede exceder 5 MB.");
      return;
    }
    setSelectedAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    clearMessages();
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
    setFileError("");
    setAvatarPreview(profile?.avatarUrl ? getAssetUrl(profile.avatarUrl) : null);
  };

  // Operation submit handlers
  const handlePersonalSubmit = async (data: PersonalInfoFormData) => {
    try {
      await updateProfile(data);
      setSuccessMessage("Tus datos personales han sido actualizados exitosamente.");
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccessMessage("Tu contraseña ha sido actualizada exitosamente.");
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatarFile) return;
    try {
      await uploadAvatar(selectedAvatarFile);
      setSelectedAvatarFile(null);
      setFileError("");
      setSuccessMessage("Tu foto de perfil ha sido actualizada exitosamente.");
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const openConfirmRemove = () => {
    setIsConfirmRemoveOpen(true);
  };

  const closeConfirmRemove = () => {
    setIsConfirmRemoveOpen(false);
  };

  const handleConfirmRemoveAvatar = async () => {
    try {
      await removeAvatar();
      setSelectedAvatarFile(null);
      setAvatarPreview(null);
      closeConfirmRemove();
      setSuccessMessage("Tu foto de perfil ha sido eliminada exitosamente.");
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage("");
  };

  // Computed display properties
  const fullName =
    profile?.firstName || profile?.lastName
      ? `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()
      : profile?.email?.split("@")[0] || "Usuario";

  const userInitial = (
    profile?.firstName?.[0] ||
    profile?.email?.[0] ||
    "U"
  ).toUpperCase();

  const formattedJoinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : "Recientemente";

  return {
    profile,
    loading,
    fetchError,
    mutationError,
    fileError,
    isMutating,
    activeTab,
    setActiveTab,
    selectedAvatarFile,
    avatarPreview,
    isDragOver,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleSaveAvatar,
    handleCancelAvatarSelection,
    openConfirmRemove,
    closeConfirmRemove,
    isConfirmRemoveOpen,
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
