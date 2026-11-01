import { useState, useRef, useEffect, useCallback } from "react";

export interface DropdownCoords {
  top?: number;
  bottom?: number;
  right: number;
  openUp: boolean;
}

export function useDropdownPosition(estimatedHeight = 360) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    if (openUp) {
      setCoords({
        bottom: window.innerHeight - rect.top + 6,
        right: window.innerWidth - rect.right,
        openUp: true,
      });
    } else {
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
        openUp: false,
      });
    }
  }, [estimatedHeight]);

  const openDropdown = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) updatePosition();
      return !prev;
    });
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleScrollOrResize = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return {
    isOpen,
    coords,
    triggerRef,
    menuRef,
    openDropdown,
    closeDropdown,
    toggleDropdown,
  };
}

