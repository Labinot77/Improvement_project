"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/is_mobile";

export interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: React.ReactNode;
  description?: React.ReactNode;

  /** Body content — forms, filters, edit fields, confirmation copy, etc. */
  children: React.ReactNode;

  /** Footer actions — buttons, rendered inside DialogFooter / DrawerFooter. */
  footer?: React.ReactNode;

  /** Hides the header block entirely (e.g. when title is only for a11y). */
  hideHeader?: boolean;

  /** Applied to the Dialog's max-width on desktop. Ignored on mobile (Drawer is always full-width). */
  desktopClassName?: string;

  /** Applied to the inner content wrapper on both surfaces. */
  className?: string;

  /** Prevents closing via overlay click / swipe-down while true (e.g. mid-save). */
  preventClose?: boolean;
}

/**
 * Renders a Dialog on desktop (>= lg) and a Drawer on mobile (< lg),
 * sharing one prop surface so callers don't need to know which
 * underlying primitive is active. Use this for anything that today
 * would be a Dialog-based modal: edits, forms, filters, confirmations.
 *
 * NOTE: children/footer render identically on both surfaces — keep body
 * content layout-agnostic (avoid hardcoding desktop-only widths) since
 * it needs to look right full-width in a bottom drawer too.
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  hideHeader = false,
  desktopClassName,
  className,
  preventClose = false,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  // Base UI's onOpenChange may pass additional event-detail args (e.g. for
  // eventDetails.cancel()) — we only care about the boolean here, and block
  // closing entirely via `preventClose` rather than per-source cancellation.
  function handleOpenChange(next: boolean, ..._rest: unknown[]) {
    if (preventClose && !next) return;
    onOpenChange(next);
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="border-white/[0.08] bg-[#0f0f0f]">
          {!hideHeader && (title || description) && (
            <DrawerHeader className="text-left">
              {title && (
                <DrawerTitle className="text-base font-semibold text-zinc-100">
                  {title}
                </DrawerTitle>
              )}
              {description && (
                <DrawerDescription className="text-sm text-zinc-500">
                  {description}
                </DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <div className={cn("px-4 pb-2 overflow-y-auto mt-4 mb-4", className)}>{children}</div>

          {footer && (
            <DrawerFooter className="pt-2">{footer}</DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl",
          desktopClassName ?? "max-w-sm",
        )}
      >
        {!hideHeader && (title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-base font-semibold text-zinc-100">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-sm text-zinc-500">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className={className}>{children}</div>

        {footer && <DialogFooter className="mt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}