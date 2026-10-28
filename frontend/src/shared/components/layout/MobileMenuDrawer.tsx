import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  ChevronDown,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "@/shared/hooks/store/useAuthStore";
import { getAssetUrl } from "@/lib/api-client";
import {
  navigationConfig,
  isNavGroup,
  type NavEntryConfig,
  type NavItemConfig,
} from "./navigation.config";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  menu?: NavEntryConfig[];
}

const isPathActive = (item: NavItemConfig, currentPath: string): boolean => {
  if (item.matchPaths && item.matchPaths.some((p) => p === currentPath)) {
    return true;
  }
  if (item.path === "/") {
    return currentPath === "/";
  }
  return currentPath === item.path || currentPath.startsWith(`${item.path}/`);
};

export function MobileMenuDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  menu = navigationConfig,
}: MobileMenuDrawerProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // User manual overrides for accordion expansion (defaults reactively to whether a child is active)
  const [manualToggle, setManualToggle] = useState<Record<string, boolean>>({});

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleGroup = (title: string, defaultExpanded: boolean) => {
    setManualToggle((prev) => ({
      ...prev,
      [title]: prev[title] !== undefined ? !prev[title] : !defaultExpanded,
    }));
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ""}`.trim();
    }
    return user?.email?.split("@")[0] || "Usuario";
  };

  const getRoleLabel = () => {
    if (user?.roles?.[0] === "ADMIN_ROLE") return "Administrador";
    return user?.roles?.[0]?.replace("_ROLE", "") || "Usuario";
  };

  const getInitials = () => {
    if (user?.firstName) return user.firstName[0].toUpperCase();
    return (user?.email?.charAt(0) || "U").toUpperCase();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Sheet */}
      <div className="relative w-full max-h-[85vh] bg-[var(--color-surface-card)] rounded-t-3xl border-t border-[var(--color-border)] shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white bg-gradient-to-tr from-[#22B2B8] to-[#F43F5E] shadow-xs">
              {user?.avatarUrl ? (
                <img
                  src={getAssetUrl(user.avatarUrl)}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold">{getInitials()}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                {getDisplayName()}
              </span>
              <span className="text-[11px] font-medium text-[#22B2B8] dark:text-[#38D5DB]">
                {getRoleLabel()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors"
            title="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tools: Search + Theme Toggle */}
        <div className="grid grid-cols-2 gap-2.5 px-6 py-3 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-surface-bg)]/40">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#22B2B8] transition-all text-left shadow-xs"
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">Buscar datos...</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#8B5CF6] transition-all shadow-xs"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tree Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {menu.map((entry, index) => {
            if (isNavGroup(entry)) {
              const groupHasActive = entry.children.some((c) =>
                isPathActive(c, location.pathname)
              );
              const isExpanded =
                manualToggle[entry.title] !== undefined
                  ? manualToggle[entry.title]
                  : groupHasActive;

              return (
                <div key={entry.title || index} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(entry.title, groupHasActive)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      groupHasActive
                        ? "text-[var(--color-text-primary)] font-semibold bg-[var(--color-surface-hover)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {entry.icon}
                      <span>{entry.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Submenu items */}
                  {isExpanded && (
                    <div className="pl-11 pr-2 space-y-1 pb-1 animate-in slide-in-from-top-1 duration-200">
                      {entry.children.map((subItem) => {
                        const active = isPathActive(subItem, location.pathname);
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              active
                                ? "text-[#22B2B8] dark:text-[#38D5DB] bg-cyan-500/10 font-semibold"
                                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                            }`}
                          >
                            <span>{subItem.title}</span>
                            {active && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#22B2B8] to-[#F43F5E]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = isPathActive(entry, location.pathname);
            return (
              <Link
                key={entry.path}
                to={entry.path}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "text-[#22B2B8] dark:text-[#38D5DB] bg-cyan-500/10 font-semibold"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {entry.icon}
                  <span>{entry.title}</span>
                </div>
                {active && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#22B2B8] to-[#F43F5E]" />
                )}
              </Link>
            );
          })}

          {/* User Profile shortcut link */}
          <Link
            to="/profile"
            onClick={handleLinkClick}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === "/profile"
                ? "text-[#8B5CF6] dark:text-[#A78BFA] bg-purple-500/10 font-semibold"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-[#8B5CF6] dark:bg-purple-500/25 dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span>Mi Perfil</span>
            </div>
            {location.pathname === "/profile" && (
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#F43F5E]" />
            )}
          </Link>
        </div>

        {/* Footer: Logout */}
        <div className="p-4 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-surface-bg)]/30 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenuDrawer;
