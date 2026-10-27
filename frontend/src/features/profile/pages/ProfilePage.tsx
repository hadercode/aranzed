import { AlertCircle, RefreshCw } from "lucide-react";
import { useProfilePage } from "../hooks/logic/useProfilePage";
import { ProfileHeroHeader } from "../components/ProfileHeroHeader";
import { PersonalTab } from "../components/PersonalTab";
import { SecurityTab } from "../components/SecurityTab";
import { AvatarTab } from "../components/AvatarTab";
import { ConfirmDialog, SuccessDialog } from "@/shared/components/ui";

export function ProfilePage() {
  const {
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
    clearMessages,
  } = useProfilePage();

  return (
    <div className="max-w-8xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Error Notifications */}
      {(mutationError || fetchError) && (
        <div className="alert-danger flex items-center gap-3 p-4 rounded-xl text-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 shadow-sm transition-all animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-700 dark:text-rose-400" />
          <p className="text-sm font-medium">{mutationError || fetchError}</p>
        </div>
      )}

      {/* Hero Header Card with Tabs */}
      <ProfileHeroHeader
        profile={profile}
        avatarPreview={avatarPreview}
        fullName={fullName}
        userInitial={userInitial}
        formattedJoinDate={formattedJoinDate}
        onAvatarClick={() => {
          setActiveTab("avatar");
          fileInputRef.current?.click();
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          clearMessages();
        }}
      />

      {/* Main Tab Contents */}
      {loading ? (
        <div className="text-center bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[var(--color-sage-500)] mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Cargando información del perfil...
          </p>
        </div>
      ) : (
        <>
          {activeTab === "personal" && (
            <PersonalTab
              profile={profile}
              onSubmit={handlePersonalSubmit}
              isMutating={isMutating}
            />
          )}

          {activeTab === "security" && (
            <SecurityTab
              onSubmit={handlePasswordSubmit}
              isMutating={isMutating}
            />
          )}

          {activeTab === "avatar" && (
            <AvatarTab
              selectedAvatarFile={selectedAvatarFile}
              avatarPreview={avatarPreview}
              isDragOver={isDragOver}
              isMutating={isMutating}
              userInitial={userInitial}
              fileError={fileError}
              fileInputRef={fileInputRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileInputChange={handleFileInputChange}
              onSaveAvatar={handleSaveAvatar}
              onOpenConfirmRemove={openConfirmRemove}
              onCancelSelection={handleCancelAvatarSelection}
            />
          )}
        </>
      )}

      {/* Confirm Remove Avatar Dialog */}
      <ConfirmDialog
        isOpen={isConfirmRemoveOpen}
        title="Eliminar Foto de Perfil"
        message="¿Estás seguro de que deseas eliminar tu foto de perfil? Se mostrarán las iniciales de tu nombre en su lugar."
        confirmText="Eliminar Foto"
        variant="danger"
        loading={isMutating}
        onConfirm={handleConfirmRemoveAvatar}
        onClose={closeConfirmRemove}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Operación Exitosa!"
        message={successMessage}
        buttonText="Aceptar"
        onClose={closeSuccess}
      />
    </div>
  );
}

export default ProfilePage;
