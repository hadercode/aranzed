import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderTree,
  ShoppingBag,
  Boxes,
  Menu,
} from "lucide-react";
import { useScrollVisibility } from "@/shared/hooks/ui";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import {
  navigationConfig,
  type NavEntryConfig,
} from "./navigation.config";

export interface MobileBottomBarProps {
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  menu?: NavEntryConfig[];
}

/**
 * Checks whether the current path belongs to a dedicated full-page form
 * where a sticky save/cancel action bar is rendered at the bottom.
 */
function isFormRoute(pathname: string): boolean {
  return (
    pathname.endsWith("/new") ||
    pathname.endsWith("/edit") ||
    pathname.includes("/edit/") ||
    pathname.includes("/new/")
  );
}

export function MobileBottomBar({
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  menu = navigationConfig,
}: MobileBottomBarProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dynamic scroll direction hook: hides bar when scrolling down, shows when scrolling up
  const isScrollVisible = useScrollVisibility({
    threshold: 10,
    topOffset: 45,
  });

  // Dedicated full-page forms render their own sticky action bar (Cancel/Save)
  const isForm = useMemo(() => isFormRoute(location.pathname), [location.pathname]);

  // Primary destinations for the 5-tab mobile bottom bar
  const tabs = [
    {
      id: "home",
      label: "Inicio",
      path: "/",
      icon: <Home className="w-5 h-5" />,
      isActive: location.pathname === "/",
    },
    {
      id: "catalog",
      label: "Catálogo",
      path: "/catalog/products",
      icon: <FolderTree className="w-5 h-5" />,
      isActive:
        location.pathname.startsWith("/catalog") ||
        location.pathname.startsWith("/products") ||
        location.pathname.startsWith("/recipes"),
    },
    {
      id: "sales",
      label: "Ventas",
      path: "/sales",
      icon: <ShoppingBag className="w-5 h-5" />,
      isActive: location.pathname.startsWith("/sales"),
    },
    {
      id: "inventory",
      label: "Inventario",
      path: "/inventory/stocks",
      icon: <Boxes className="w-5 h-5" />,
      isActive: location.pathname.startsWith("/inventory"),
    },
  ];

  // If the current route is not one of the 4 tabs (e.g. Purchases, Profile, IAM, Company)
  const isOtherActive =
    !tabs.some((tab) => tab.isActive) && location.pathname !== "/";

  // Hide on dedicated form pages to allow StickyBar priority
  if (isForm) {
    return (
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSearch={onOpenSearch}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        menu={menu}
      />
    );
  }

  return (
    <>
      <nav
        aria-label="Navegación móvil"
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-all duration-300 ease-in-out pointer-events-none pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-3 ${
          isScrollVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-[120%] opacity-0"
        }`}
      >
        <div className="max-w-md mx-auto pointer-events-auto rounded-2xl bg-[var(--color-surface-card)]/90 dark:bg-[var(--color-surface-card)]/95 backdrop-blur-xl border border-[var(--color-border)] shadow-xl shadow-black/10 dark:shadow-black/40 px-2 py-1.5 transition-colors">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                  tab.isActive
                    ? "text-[#22B2B8] dark:text-[#38D5DB]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    tab.isActive
                      ? "bg-gradient-to-tr from-[#22B2B8]/20 via-[#8B5CF6]/15 to-[#F43F5E]/15 text-[#22B2B8] dark:text-[#38D5DB] shadow-xs"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                  {tab.label}
                </span>

                {tab.isActive && (
                  <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#22B2B8] to-[#F43F5E]" />
                )}
              </Link>
            ))}

            {/* Menú Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                isOtherActive || isMenuOpen
                  ? "text-[#F43F5E] dark:text-[#FB7185]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isOtherActive || isMenuOpen
                    ? "bg-rose-500/15 text-[#F43F5E] dark:text-[#FB7185] shadow-xs"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <Menu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                Menú
              </span>

              {/* Active dot if an inner menu route is active */}
              {isOtherActive && (
                <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#F43F5E] to-[#F97316] ring-2 ring-[var(--color-surface-card)] animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-up Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenSearch={onOpenSearch}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        menu={menu}
      />
    </>
  );
}

export default MobileBottomBar;
