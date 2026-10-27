import React from "react";
import { AlertCircle } from "lucide-react";
import { AvatarDropzone } from "./AvatarDropzone";
import { AvatarPreviewActions } from "./AvatarPreviewActions";
import { AvatarTipsSidebar } from "./AvatarTipsSidebar";

interface AvatarTabProps {
  selectedAvatarFile: File | null;
  avatarPreview: string | null;
  isDragOver: boolean;
  isMutating: boolean;
  userInitial: string;
  fileError?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveAvatar: () => void;
  onOpenConfirmRemove: () => void;
  onCancelSelection: () => void;
}

export function AvatarTab({
  selectedAvatarFile,
  avatarPreview,
  isDragOver,
  isMutating,
  userInitial,
  fileError,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange,
  onSaveAvatar,
  onOpenConfirmRemove,
  onCancelSelection,
}: AvatarTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Avatar Uploader Section */}
      <div className="lg:col-span-2 bg-[var(--color-surface-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Foto de Perfil
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Sube una foto profesional para identificarte en el sistema.
          </p>
        </div>

        {fileError && (
          <div className="alert-danger flex items-center gap-3 p-3.5 rounded-xl text-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 shadow-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700 dark:text-rose-400" />
            <p className="text-xs font-medium">{fileError}</p>
          </div>
        )}

        {/* Dropzone Area */}
        <AvatarDropzone
          fileInputRef={fileInputRef}
          isDragOver={isDragOver}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onFileInputChange={onFileInputChange}
        />

        {/* Preview & Actions */}
        <AvatarPreviewActions
          avatarPreview={avatarPreview}
          selectedAvatarFile={selectedAvatarFile}
          userInitial={userInitial}
          isMutating={isMutating}
          onOpenConfirmRemove={onOpenConfirmRemove}
          onCancelSelection={onCancelSelection}
          onSaveAvatar={onSaveAvatar}
        />
      </div>

      {/* Avatar Tips Sidebar */}
      <AvatarTipsSidebar />
    </div>
  );
}

export default AvatarTab;
