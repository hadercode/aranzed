import { User, Lock, Camera } from "lucide-react";

export type ProfileTab = "personal" | "security" | "avatar";

export interface ProfileHeaderTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileHeaderTabs({
  activeTab,
  onTabChange,
}: ProfileHeaderTabsProps) {
  return (
    <div className="flex border-b border-[var(--color-border)] mt-8 gap-2 overflow-x-auto">
      <button
        onClick={() => onTabChange("personal")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
          activeTab === "personal"
            ? "border-[#F43F5E] text-[#F43F5E] dark:text-[#FB7185] font-semibold"
            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]"
        }`}
      >
        <User className="w-4 h-4" />
        <span>Datos Personales</span>
      </button>

      <button
        onClick={() => onTabChange("security")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
          activeTab === "security"
            ? "border-[#F43F5E] text-[#F43F5E] dark:text-[#FB7185] font-semibold"
            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]"
        }`}
      >
        <Lock className="w-4 h-4" />
        <span>Seguridad y Contraseña</span>
      </button>

      <button
        onClick={() => onTabChange("avatar")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
          activeTab === "avatar"
            ? "border-[#F43F5E] text-[#F43F5E] dark:text-[#FB7185] font-semibold"
            : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]"
        }`}
      >
        <Camera className="w-4 h-4" />
        <span>Foto de Perfil</span>
      </button>
    </div>
  );
}

export default ProfileHeaderTabs;
