import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Header } from "./layout/Header";
import { SearchModal } from "./layout/SearchModal";
import { MobileBottomBar } from "./layout/MobileBottomBar";

import { GlobalFeedbackBanner, PwaReloadPrompt } from "./feedback";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Sidebar (visible on md: and desktop, hidden on mobile) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 transition-colors duration-300">
        {/* Header */}
        <Header onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Page Content */}
        <div className="flex-1 bg-[var(--color-surface-bg)] px-4 sm:px-6 md:px-10 pb-28 md:pb-10">
          <GlobalFeedbackBanner />
          <Outlet />
        </div>
      </main>

      {/* Mobile Dynamic Bottom Navigation Bar */}
      <MobileBottomBar
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* PWA Update & Offline Notification Toast */}
      <PwaReloadPrompt />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
