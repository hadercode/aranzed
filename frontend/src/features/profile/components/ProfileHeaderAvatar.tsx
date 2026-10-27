import { Camera } from "lucide-react";

export interface ProfileHeaderAvatarProps {
  avatarPreview: string | null;
  fullName: string;
  userInitial: string;
  onAvatarClick: () => void;
}

export function ProfileHeaderAvatar({
  avatarPreview,
  fullName,
  userInitial,
  onAvatarClick,
}: ProfileHeaderAvatarProps) {
  return (
    <div className="relative group shrink-0">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-[var(--color-surface-card)] shadow-xl bg-[var(--color-surface-hover)] flex items-center justify-center">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt={fullName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-sage-500)] to-[var(--color-sage-600)] flex items-center justify-center text-white text-4xl font-bold">
            {userInitial}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onAvatarClick}
        title="Cambiar foto de perfil"
        className="absolute bottom-1 right-1 p-2 rounded-xl bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-sage-50)] hover:text-[var(--color-sage-600)] shadow-md border border-[var(--color-border)] transition-transform duration-200 hover:scale-110 cursor-pointer"
      >
        <Camera className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ProfileHeaderAvatar;
