import type { UserProfile } from "../hooks/queries/useProfileQuery";
import { ProfileCover } from "./ProfileCover";
import { ProfileHeaderAvatar } from "./ProfileHeaderAvatar";
import { ProfileHeaderMeta } from "./ProfileHeaderMeta";
import {
  ProfileHeaderTabs,
  type ProfileTab,
} from "./ProfileHeaderTabs";

export type { ProfileTab };

export interface ProfileHeroHeaderProps {
  profile: UserProfile | null;
  formData?: Partial<UserProfile>;
  avatarPreview: string | null;
  fullName: string;
  userInitial: string;
  formattedJoinDate: string;
  onAvatarClick: () => void;
  activeTab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
}

export function ProfileHeroHeader({
  profile,
  formData,
  avatarPreview,
  fullName,
  userInitial,
  formattedJoinDate,
  onAvatarClick,
  activeTab,
  onTabChange,
}: ProfileHeroHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm">
      {/* Cover Background Graphic */}
      <ProfileCover />

      {/* Profile Info Overlay */}
      <div className="px-6 sm:px-8 pb-6 pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
          {/* Avatar with Camera Trigger */}
          <ProfileHeaderAvatar
            avatarPreview={avatarPreview}
            fullName={fullName}
            userInitial={userInitial}
            onAvatarClick={onAvatarClick}
          />

          {/* User Meta Information */}
          <ProfileHeaderMeta
            profile={profile}
            formData={formData}
            fullName={fullName}
            formattedJoinDate={formattedJoinDate}
          />
        </div>

        {/* Tab Navigation if provided */}
        {activeTab && onTabChange && (
          <ProfileHeaderTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )}
      </div>
    </div>
  );
}

export default ProfileHeroHeader;
