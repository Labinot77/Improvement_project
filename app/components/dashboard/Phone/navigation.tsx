"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cards } from "@/constants/main";

const SCROLL_THRESHOLD = 84; // px scrolled before collapsing
const SCROLL_UP_TOLERANCE = 6; // ignore tiny jitter when deciding to re-expand

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  const activeIndex = cards.findIndex((c) => c.href === pathname);
  const hasActiveCard = activeIndex !== -1;
  // Fallback for routes not represented in `cards` (e.g. a detail page) —
  // show the shell in its collapsed-icon form, but don't lie about which
  // tab is "active" by defaulting to index 0.
  const displayIndex = hasActiveCard ? activeIndex : 0;
  const activeCard = cards[displayIndex];

  useEffect(() => {
    // Re-sync on every route change: a route can be entered via deep link,
    // back/forward nav, or a link outside this component, none of which
    // trigger a scroll event. Without this, `collapsed` can be stale from
    // the previous page.
    lastScrollY.current = window.scrollY;
    setCollapsed(window.scrollY > SCROLL_THRESHOLD);
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= SCROLL_THRESHOLD) {
        setCollapsed(false);
      } else if (delta > SCROLL_UP_TOLERANCE) {
        setCollapsed(true);
      } else if (delta < -SCROLL_UP_TOLERANCE) {
        setCollapsed(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleNavigate(href: string) {
    router.push(href);
  }

  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      {/* pb-[env(safe-area-inset-bottom)] keeps the pill clear of the home
          indicator on notched/gesture-nav devices instead of a fixed bottom-4 */}
      <div className="relative h-0 pb-[env(safe-area-inset-bottom)]">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.7 }}
          className={
            collapsed
              ? "pointer-events-auto absolute bottom-4 left-4 flex items-center justify-center rounded-full overflow-hidden size-14 border border-white/[0.14] bg-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] supports-backdrop-filter:bg-white/[0.06]"
              : "pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full overflow-x-auto no-scrollbar border border-white/[0.14] bg-white/[0.08] backdrop-blur-2xl px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] supports-backdrop-filter:bg-white/[0.06] max-w-[calc(100vw-1.5rem)]"
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            {collapsed ? (
              <motion.button
                key="collapsed"
                onClick={() => setCollapsed(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative flex size-14 shrink-0 items-center justify-center"
                aria-label={
                  hasActiveCard
                    ? `${activeCard.title} — expand navigation`
                    : "Expand navigation"
                }
              >
                <span
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${activeCard.accentGlow}, transparent 70%)`,
                  }}
                />
                {/* Faint ring signals "there's more here" for an icon-only,
                    non-obviously-interactive control */}
                <span className="absolute inset-1.5 rounded-full border border-white/[0.10]" />
                <span className="relative text-xl leading-none">{activeCard.emoji}</span>
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="flex items-center gap-1"
              >
                {cards.map((card, i) => {
                  const isActive = hasActiveCard && i === activeIndex;
                  return (
                    <button
                      key={card.href}
                      onClick={() => handleNavigate(card.href)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={card.title}
                      className="relative flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2.5 min-w-14 min-h-14"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-nav-active-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `radial-gradient(circle at 50% 30%, ${card.accentGlow}, transparent 75%)`,
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative text-lg leading-none">{card.emoji}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}