import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/store/useAuthStore";
import { SearchIcon, UserIcon, ChevronDownIcon } from "./icons";
import { Download } from "lucide-react";
import { getAssetUrl } from "@/lib/api-client";
import { usePwaInstall } from "@/shared/hooks/ui";

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header = ({ onOpenSearch }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { isInstallable, promptInstall } = usePwaInstall();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    return user?.email?.split("@")[0] || "Usuario";
  };

  const getRoleLabel = () => {
    if (user?.roles?.[0] === "ADMIN_ROLE") {
      return "Admin";
    }
    return user?.roles?.[0]?.replace("_ROLE", "") || "Usuario";
  };

  const getInitials = () => {
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    return (user?.email?.charAt(0) || "U").toUpperCase();
  };

  return (
    <div className="flex flex-col">
      {/* Rainbow Spectrum Accent Top Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] via-[#F43F5E] via-[#F97316] to-[#F59E0B] shadow-xs" />
      <header className="flex justify-between md:justify-end items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 md:px-10 md:py-6 bg-[var(--color-surface-bg)] transition-colors">
        {/* Mobile Brand Logo (visible only on mobile where sidebar is hidden) */}
        <Link to="/" className="flex md:hidden items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-xs tracking-wider">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] bg-clip-text text-transparent">
              ARANZED
            </span>
            <span className="text-[9px] tracking-wider uppercase font-semibold text-[#F43F5E] dark:text-[#FB7185] -mt-1">
              Detalles
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* PWA Install Button (visible when browser allows installing) */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#22B2B8] to-[#8B5CF6] hover:opacity-90 transition-all shadow-xs cursor-pointer shrink-0"
              title="Instalar aplicación en tu dispositivo"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 sm:py-2 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full text-xs sm:text-sm text-[var(--color-text-secondary)] hover:border-[#22B2B8] transition-all w-36 sm:w-56 md:w-72 text-left shadow-xs cursor-pointer group"
            title="Buscar menús y accesos rápidos (Ctrl+K o ⌘K)"
          >
            <SearchIcon className="w-4 h-4 text-gray-400 group-hover:text-[#22B2B8] shrink-0 transition-colors" />
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              Buscar menús y accesos...
            </span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] rounded border border-[var(--color-border)] shrink-0">
              ⌘K
            </kbd>
          </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 border-l pl-4 border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-hover)] p-2 rounded-lg transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white bg-gradient-to-tr from-[#22B2B8] to-[#F43F5E] ring-2 ring-pink-500/20 shadow-xs">
              {user?.avatarUrl ? (
                <img
                  src={getAssetUrl(user.avatarUrl)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold">{getInitials()}</span>
              )}
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-[var(--color-text-primary)]">
                {getDisplayName()}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {getRoleLabel()}
              </p>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[var(--color-surface-card)] rounded-xl shadow-lg border border-[var(--color-border)] py-1 z-30 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {user?.email || "user@nexus.com"}
                </p>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <UserIcon />
                <span>Mi Perfil</span>
              </Link>
              <div className="border-t border-[var(--color-border)] my-1"></div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  </div>
);
};

export default Header;
