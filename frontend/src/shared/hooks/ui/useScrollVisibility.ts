import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export interface UseScrollVisibilityOptions {
  threshold?: number;
  initialVisible?: boolean;
  topOffset?: number;
}

/**
 * Custom hook to dynamically control visibility of floating UI bars
 * based on user scroll direction (hides on scroll down, shows on scroll up).
 * Automatically stays visible at the top and bottom extremes of the viewport,
 * and resets to visible upon route change.
 */
export function useScrollVisibility({
  threshold = 10,
  initialVisible = true,
  topOffset = 45,
}: UseScrollVisibilityOptions = {}) {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const location = useLocation();

  // Reset visibility upon route transition without triggering set-state-in-effect lint warnings
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsVisible(true);
  }

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const maxScrollY =
            document.documentElement.scrollHeight - window.innerHeight;

          // Always visible near top of page
          if (currentScrollY <= topOffset) {
            setIsVisible(true);
            lastScrollY.current = currentScrollY;
            ticking.current = false;
            return;
          }

          // Always visible near bottom of page
          if (currentScrollY >= maxScrollY - 24) {
            setIsVisible(true);
            lastScrollY.current = currentScrollY;
            ticking.current = false;
            return;
          }

          const diff = currentScrollY - lastScrollY.current;

          // Only toggle when scrolling exceeds sensitivity threshold
          if (Math.abs(diff) >= threshold) {
            if (diff > 0) {
              // Scrolling down -> hide bar
              setIsVisible(false);
            } else {
              // Scrolling up -> show bar
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, topOffset]);

  return isVisible;
}
