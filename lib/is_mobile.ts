"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 1024; // matches Tailwind's `lg` — same threshold as MobileNav's lg:hidden

/**
 * Returns true when viewport width is below the `lg` breakpoint.
 * Returns `false` on first render (SSR-safe default) and syncs
 * immediately on mount, then tracks resize/orientation changes.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    function handleChange() {
      setIsMobile(mql.matches);
    }

    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}