import { useLocation } from "react-router-dom";
import { SunIcon, MoonIcon, MenuToggleIcon } from "./icons";

import {
  navigationConfig,
  isNavGroup,
  type NavEntryConfig,
  type NavItemConfig,
} from "./navigation.config";
import { NavItem } from "./NavItem";
import { NavGroup } from "./NavGroup";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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

export const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  onToggleDarkMode,
  menu = navigationConfig,
}: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:flex transition-all duration-300 border-r border-[var(--color-border)] flex-col py-6 h-screen sticky top-0 shadow-sm z-20 backdrop-blur-md shrink-0`}
      style={{ backgroundColor: "rgb(34 178 184 / 16%)" }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 mb-8">
        <div
          className={`flex items-center gap-3 transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 hidden" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20">
            <span className="text-white font-extrabold text-sm tracking-wider">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] bg-clip-text text-transparent">
              ARANZED
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#F43F5E] dark:text-[#FB7185] -mt-0.5">
              Detalles Maracaibo
            </span>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors ${
            isCollapsed ? "mx-auto" : ""
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuToggleIcon />
        </button>
      </div>

      {/* Dynamic Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
        {menu.map((entry, index) => {
          if (isNavGroup(entry)) {
            return (
              <NavGroup
                key={entry.title || index}
                title={entry.title}
                icon={entry.icon}
                collapsed={isCollapsed}
              >
                {entry.children.map((subItem) => (
                  <NavItem
                    key={subItem.path}
                    to={subItem.path}
                    collapsed={isCollapsed}
                    active={isPathActive(subItem, location.pathname)}
                    isSub
                  >
                    {subItem.title}
                  </NavItem>
                ))}
              </NavGroup>
            );
          }

          return (
            <NavItem
              key={entry.path}
              to={entry.path}
              icon={entry.icon}
              active={isPathActive(entry, location.pathname)}
              collapsed={isCollapsed}
            >
              {entry.title}
            </NavItem>
          );
        })}
      </nav>

      {/* Theme Toggle in Sidebar */}
      <div className="px-4 mt-auto">
        <button
          onClick={onToggleDarkMode}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm transition-all duration-200 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
          {!isCollapsed && (
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
