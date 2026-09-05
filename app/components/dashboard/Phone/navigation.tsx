"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cards } from "@/constants/main";

const SCROLL_THRESHOLD = 24; // px scrolled before collapsing
const SCROLL_UP_TOLERANCE = 4; // ignore tiny jitter when deciding to re-expand

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  const activeIndex = Math.max(
    0,
    cards.findIndex((c) => c.href === pathname),
  );
  const activeCard = cards[activeIndex] ?? cards[0];

  useEffect(() => {
    lastScrollY.current = window.scrollY;

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
      <div className="relative h-0">
        {/*
          Single persistent shell. `layout` (not layoutId across two elements)
          lets Framer Motion FLIP its own width/height/border-radius/position
          smoothly, while collapsed/expanded positioning is driven by plain
          CSS classes rather than remounting the element. Inner content
          cross-fades on its own timeline so the two animations don't fight.
        */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.7 }}
          className={
            collapsed
              ? "pointer-events-auto absolute bottom-4 left-4 flex items-center justify-center rounded-full overflow-hidden size-13 border border-white/[0.14] bg-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] supports-backdrop-filter:bg-white/[0.06]"
              : "pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full overflow-x-auto no-scrollbar border border-white/[0.14] bg-white/[0.08] backdrop-blur-2xl px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] supports-backdrop-filter:bg-white/[0.06] max-w-[calc(100vw-1.5rem)]"
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
                className="relative flex size-13 shrink-0 items-center justify-center"
                aria-label={`${activeCard.title} — expand navigation`}
              >
                <span
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: `radial-gradient(circle at 30% 20%, ${activeCard.accentGlow}, transparent 70%)`,
                  }}
                />
                <span className="relative text-xl leading-none">{activeCard.emoji}</span>
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="flex items-center gap-0.5"
              >
                {cards.map((card, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={card.href}
                      onClick={() => handleNavigate(card.href)}
                      className="relative flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-full px-2.5 py-1.5 min-w-11.5"
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
                      <span className="relative text-base leading-none">{card.emoji}</span>
                      {/* <span
                        className="relative text-[9px] font-medium leading-none whitespace-nowrap"
                        style={{ color: isActive ? "#f4f4f5" : "#71717a" }}
                      >
                        {card.title}
                      </span> */}
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